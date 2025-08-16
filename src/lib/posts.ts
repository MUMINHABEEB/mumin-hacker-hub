import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string; // ISO
  tags?: string[];
  excerpt?: string;
}

export interface Post extends PostFrontmatter {
  content: string;
  filename?: string;
  sha?: string;
}

// GitHub repository configuration
const GITHUB_OWNER = 'MUMINHABEEB';
const GITHUB_REPO = 'mumin-hacker-hub';
const POSTS_PATH = 'src/posts';

// Cache for posts
let cached: Post[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Parse markdown content with frontmatter
const parseMarkdown = (content: string, filename: string, sha?: string): Post => {
  const lines = content.split('\n');
  let frontmatterEnd = -1;
  let frontmatterStart = -1;

  // Find frontmatter boundaries
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (frontmatterStart === -1) {
        frontmatterStart = i;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }

  let title = '';
  let date = '';
  let tags: string[] = [];
  let excerpt = '';
  let postContent = content;

  if (frontmatterStart !== -1 && frontmatterEnd !== -1) {
    // Parse frontmatter
    const frontmatter = lines.slice(frontmatterStart + 1, frontmatterEnd).join('\n');
    postContent = lines.slice(frontmatterEnd + 1).join('\n').trim();

    // Extract frontmatter fields
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/);
    const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
    const excerptMatch = frontmatter.match(/excerpt:\s*"([^"]+)"/);

    title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
    date = dateMatch ? dateMatch[1] : new Date().toISOString();
    excerpt = excerptMatch ? excerptMatch[1] : '';
    
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/"/g, ''));
    }
  } else {
    // No frontmatter, use filename as title
    title = filename.replace('.md', '').replace(/-/g, ' ');
    date = new Date().toISOString();
  }

  return {
    title,
    slug: generateSlug(title),
    date,
    tags,
    excerpt: excerpt || postContent.substring(0, 150) + '...',
    content: postContent,
    filename,
    sha
  };
};

// Generate a slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 50);
}

// Load posts from GitHub API (with fallback to static imports)
const loadPostsFromGitHub = async (): Promise<Post[]> => {
  try {
    // Try to get GitHub token (optional - works without it in read-only mode)
    const githubToken = localStorage?.getItem?.('github-token');
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    const markdownFiles = files.filter((file: any) => file.name.endsWith('.md'));

    const loadedPosts: Post[] = [];

    for (const file of markdownFiles) {
      try {
        const fileResponse = await fetch(file.download_url);
        const content = await fileResponse.text();
        const post = parseMarkdown(content, file.name, file.sha);
        loadedPosts.push(post);
      } catch (error) {
        console.error(`Error loading ${file.name}:`, error);
      }
    }

    // Sort by date (newest first)
    return loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  } catch (error) {
    console.error('[Blog] Failed to load from GitHub:', error);
    throw error;
  }
};

// Fallback to static imports if GitHub fails
const loadPostsFromStaticImports = async (): Promise<Post[]> => {
  try {
    // Import the current posts statically
    const staticPosts = [
      { 
        import: () => import('/src/posts/cybersecurity-from-my-perspective.md?raw'),
        filename: 'cybersecurity-from-my-perspective.md'
      },
      { 
        import: () => import('/src/posts/hello-world.md?raw'),
        filename: 'hello-world.md'
      },
      { 
        import: () => import('/src/posts/test-deployment.md?raw'),
        filename: 'test-deployment.md'
      },
      { 
        import: () => import('/src/posts/test-post-deployment-check.md?raw'),
        filename: 'test-post-deployment-check.md'
      }
    ];

    const posts: Post[] = [];

    for (const staticPost of staticPosts) {
      try {
        const module = await staticPost.import();
        const content = module.default;
        const post = parseMarkdown(content, staticPost.filename);
        posts.push(post);
      } catch (error) {
        console.warn(`Failed to load static post ${staticPost.filename}:`, error);
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('[Blog] Failed to load static imports:', error);
    return [];
  }
};

// Main function to load posts (tries GitHub first, falls back to static)
export async function loadPosts(): Promise<Post[]> {
  // Check cache first
  const now = Date.now();
  if (cached && (now - lastFetch) < CACHE_DURATION) {
    console.log('[Blog] Returning cached posts');
    return cached;
  }

  console.log('[Blog] Loading posts...');

  try {
    // Try GitHub API first
    const posts = await loadPostsFromGitHub();
    console.log(`[Blog] Loaded ${posts.length} posts from GitHub`);
    
    cached = posts;
    lastFetch = now;
    
    // Store in window for debugging
    if (typeof window !== 'undefined') {
      (window as any).__BLOG_POSTS__ = posts;
    }
    
    return posts;
  } catch (error) {
    console.warn('[Blog] GitHub failed, trying static imports...', error);
    
    try {
      // Fallback to static imports
      const posts = await loadPostsFromStaticImports();
      console.log(`[Blog] Loaded ${posts.length} posts from static imports`);
      
      cached = posts;
      lastFetch = now;
      
      return posts;
    } catch (staticError) {
      console.error('[Blog] All loading methods failed:', staticError);
      return [];
    }
  }
}

// Synchronous version for backward compatibility (returns cached or empty)
export function loadPostsSync(): Post[] {
  if (cached) {
    return cached;
  }
  
  // If no cache, trigger async load but return empty for now
  loadPosts().catch(console.error);
  return [];
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await loadPosts();
  return posts.find(p => p.slug === slug);
}

// Clear cache function
export function clearPostsCache(): void {
  cached = null;
  lastFetch = 0;
  console.log('[Blog] Posts cache cleared');
}

// Legacy functions for backward compatibility
export function addPost(post: Post): void {
  console.warn('[Blog] addPost called - use GitHub admin for real changes');
}

export function updatePost(slug: string, updatedPost: Post): void {
  console.warn('[Blog] updatePost called - use GitHub admin for real changes');
}

export function deletePost(slug: string): void {
  console.warn('[Blog] deletePost called - use GitHub admin for real changes');
}
