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
}

// Import all markdown files dynamically
const importMarkdownFiles = () => {
  const posts: Post[] = [];
  
  // Dynamically import all .md files from the posts directory
  const modules = import.meta.glob('/src/posts/*.md', { 
    query: '?raw',
    import: 'default',
    eager: true 
  });

  for (const path in modules) {
    const rawContent = modules[path] as string;
    
    try {
      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(rawContent);
      
      // Extract filename for slug if not provided
      const filename = path.split('/').pop()?.replace('.md', '') || '';
      
      const post: Post = {
        title: frontmatter.title || filename.replace(/-/g, ' '),
        slug: frontmatter.slug || filename,
        date: frontmatter.date || new Date().toISOString(),
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt || content.substring(0, 150) + '...',
        content: content.trim()
      };
      
      posts.push(post);
    } catch (error) {
      console.error(`Error parsing ${path}:`, error);
    }
  }

  return posts;
};

// Cache for posts
let cached: Post[] | null = null;

export function loadPosts(): Post[] {
  if (cached) {
    return cached;
  }
  
  console.log('[Blog] Loading posts from markdown files...');
  
  try {
    const posts = importMarkdownFiles();
    
    // Sort by date (newest first)
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    cached = sortedPosts;
    
    console.log('[Blog] Loaded posts:', sortedPosts.length);
    console.log('[Blog] Post slugs:', sortedPosts.map(p => p.slug));
    
    if (typeof window !== 'undefined') {
      // @ts-ignore - Add to window for debugging
      window.__BLOG_POSTS__ = sortedPosts;
    }
    
    return sortedPosts;
  } catch (error) {
    console.error('[Blog] Error loading posts:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | undefined {
  console.log(`[Blog] Looking for post with slug: ${slug}`);
  const posts = loadPosts();
  const post = posts.find(p => p.slug === slug);
  console.log(`[Blog] Found post:`, post ? post.title : 'not found');
  return post;
}

// Clear cache function (useful after changes)
export function clearPostsCache(): void {
  cached = null;
  console.log('[Blog] Posts cache cleared');
}

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

// Legacy functions for backward compatibility (for admin interfaces)
export function addPost(post: Post): void {
  console.warn('[Blog] addPost called - this is for admin interfaces only');
  // This function is for admin interfaces that manage GitHub directly
  // The actual site reads from imported markdown files
}

export function updatePost(slug: string, updatedPost: Post): void {
  console.warn('[Blog] updatePost called - this is for admin interfaces only');
  // This function is for admin interfaces that manage GitHub directly
  // The actual site reads from imported markdown files
}

export function deletePost(slug: string): void {
  console.warn('[Blog] deletePost called - this is for admin interfaces only');
  // This function is for admin interfaces that manage GitHub directly
  // The actual site reads from imported markdown files
}
