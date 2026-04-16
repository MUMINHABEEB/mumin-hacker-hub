import matter from "gray-matter";
import type { SocialMediaPost, SocialMediaFrontmatter } from "@/types/social-media";

// GitHub repository configuration
const GITHUB_OWNER = 'MUMINHABEEB';
const GITHUB_REPO = 'mumin-hacker-hub';
const SOCIAL_MEDIA_PATH = 'src/social-media';

// Cache for social media posts
let cachedPosts: SocialMediaPost[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Parse markdown content with frontmatter
const parseMarkdown = (content: string, filename: string, sha?: string): SocialMediaPost => {
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  const slug = filename.replace('.md', '');
  
  return {
    id: slug,
    title: frontmatter.title || slug,
    description: frontmatter.description || '',
    platform: frontmatter.platform || 'linkedin',
    url: frontmatter.url || '',
    thumbnail: frontmatter.thumbnail,
    publishDate: frontmatter.publishDate || new Date().toISOString(),
    tags: frontmatter.tags || [],
    content: markdownContent,
    metrics: frontmatter.metrics,
    featured: frontmatter.featured || false,
    status: frontmatter.status || 'published',
    slug,
    filename,
    sha
  };
};

// Fetch social media posts from GitHub
const fetchSocialMediaFromGitHub = async (): Promise<SocialMediaPost[]> => {
  try {
    // In development, try to load from local files first
    if (import.meta.env.DEV) {
      try {
        const localPosts = await loadLocalSocialMedia();
        if (localPosts.length > 0) {
          console.log('Loaded social media posts from local files:', localPosts);
          return localPosts;
        }
      } catch (localError) {
        console.log('Local social media files not available, trying GitHub API...');
      }
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOCIAL_MEDIA_PATH}`);
    
    if (!response.ok) {
      console.warn('Social media folder not found in GitHub, using static data');
      return getStaticSocialMedia();
    }

    const files = await response.json();
    const markdownFiles = Array.isArray(files) ? files.filter((file: any) => file.name.endsWith('.md')) : [];

    const posts = await Promise.all(
      markdownFiles.map(async (file: any) => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        return parseMarkdown(content, file.name, file.sha);
      })
    );

    return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error fetching social media posts from GitHub:', error);
    return getStaticSocialMedia();
  }
};

// Load social media posts from local files (development)
const loadLocalSocialMedia = async (): Promise<SocialMediaPost[]> => {
  const posts: SocialMediaPost[] = [];
  
  // Try to load sample posts
  const sampleFiles = [
    'cybersecurity-trends-2024.md',
    'phishing-detection-demo.md',
    'security-tips-remote-workers.md'
  ];
  
  for (const file of sampleFiles) {
    try {
      const response = await fetch(`/src/social-media/${file}`);
      if (response.ok) {
        const content = await response.text();
        posts.push(parseMarkdown(content, file));
      }
    } catch (error) {
      console.log(`Could not load ${file}`);
    }
  }

  return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
};

// Static fallback data
const getStaticSocialMedia = (): SocialMediaPost[] => [
  {
    id: 'cybersecurity-trends-2024',
    title: 'Top Cybersecurity Trends for 2024',
    description: 'An in-depth analysis of emerging cybersecurity threats and the latest defense strategies that organizations need to implement in 2024.',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/posts/mumin-hacker_cybersecurity-trends-2024-activity-123456789',
    thumbnail: 'https://via.placeholder.com/600x315/0077B5/FFFFFF?text=LinkedIn+Post',
    publishDate: '2024-01-15T10:00:00.000Z',
    tags: ['cybersecurity', 'trends', 'security', 'enterprise'],
    metrics: {
      views: 15420,
      likes: 245,
      comments: 34,
      shares: 67
    },
    featured: true,
    status: 'published',
    slug: 'cybersecurity-trends-2024'
  },
  {
    id: 'phishing-detection-demo',
    title: 'AI-Powered Phishing Detection Tool Demo',
    description: 'Watch how our advanced phishing detection tool uses machine learning algorithms to identify and block sophisticated phishing attempts in real-time.',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://via.placeholder.com/600x315/FF0000/FFFFFF?text=YouTube+Video',
    publishDate: '2024-01-10T14:30:00.000Z',
    tags: ['phishing', 'ai', 'machine-learning', 'demo', 'cybersecurity'],
    metrics: {
      views: 8950,
      likes: 456,
      comments: 89,
      shares: 123
    },
    featured: true,
    status: 'published',
    slug: 'phishing-detection-demo'
  },
  {
    id: 'network-security-tips',
    title: '5 Essential Network Security Tips',
    description: 'Learn about the most critical network security practices that every IT professional should implement to protect their organization.',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/posts/mumin-hacker_network-security-tips-activity-987654321',
    thumbnail: 'https://via.placeholder.com/600x315/0077B5/FFFFFF?text=Security+Tips',
    publishDate: '2024-01-05T09:15:00.000Z',
    tags: ['network-security', 'tips', 'best-practices', 'it'],
    metrics: {
      views: 12340,
      likes: 189,
      comments: 23,
      shares: 45
    },
    featured: false,
    status: 'published',
    slug: 'network-security-tips'
  },
  {
    id: 'penetration-testing-guide',
    title: 'Complete Penetration Testing Guide',
    description: 'A comprehensive video guide covering penetration testing methodologies, tools, and real-world scenarios for ethical hackers.',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=example123',
    thumbnail: 'https://via.placeholder.com/600x315/FF0000/FFFFFF?text=Pen+Testing+Guide',
    publishDate: '2023-12-28T16:45:00.000Z',
    tags: ['penetration-testing', 'ethical-hacking', 'tutorial', 'security'],
    metrics: {
      views: 25670,
      likes: 892,
      comments: 156,
      shares: 234
    },
    featured: false,
    status: 'published',
    slug: 'penetration-testing-guide'
  }
];

// Clear social media cache
export const clearSocialMediaCache = () => {
  cachedPosts = null;
  lastFetch = 0;
};

// Get all social media posts with caching
export const getAllSocialMediaPosts = async (): Promise<SocialMediaPost[]> => {
  const now = Date.now();
  
  // In development, always refresh to see changes
  if (import.meta.env.DEV || !cachedPosts || (now - lastFetch) > CACHE_DURATION) {
    console.log('Loading fresh social media posts...');
    const posts = await fetchSocialMediaFromGitHub();
    cachedPosts = posts;
    lastFetch = now;
    console.log('Loaded social media posts:', posts);
    return posts;
  }
  
  return cachedPosts;
};

// Get posts by platform
export const getPostsByPlatform = async (platform: 'linkedin' | 'youtube'): Promise<SocialMediaPost[]> => {
  const allPosts = await getAllSocialMediaPosts();
  return allPosts.filter(post => post.platform === platform);
};

// Get featured posts
export const getFeaturedSocialMediaPosts = async (): Promise<SocialMediaPost[]> => {
  const allPosts = await getAllSocialMediaPosts();
  return allPosts.filter(post => post.featured);
};

// Get post by slug
export const getSocialMediaPostBySlug = async (slug: string): Promise<SocialMediaPost | null> => {
  const allPosts = await getAllSocialMediaPosts();
  return allPosts.find(post => post.slug === slug) || null;
};

// Sort posts
export const sortPosts = (posts: SocialMediaPost[], sortOrder: 'newest' | 'oldest' | 'popular'): SocialMediaPost[] => {
  switch (sortOrder) {
    case 'newest':
      return [...posts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    case 'oldest':
      return [...posts].sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
    case 'popular':
      return [...posts].sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0));
    default:
      return posts;
  }
};

// Create new social media post
export const createSocialMediaPost = async (post: Omit<SocialMediaPost, 'id' | 'slug' | 'filename' | 'sha'>, githubToken?: string): Promise<boolean> => {
  try {
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${slug}.md`;
    
    const frontmatter: SocialMediaFrontmatter = {
      title: post.title,
      description: post.description,
      platform: post.platform,
      url: post.url,
      thumbnail: post.thumbnail,
      publishDate: post.publishDate,
      tags: post.tags,
      metrics: post.metrics,
      featured: post.featured,
      status: post.status
    };
    
    const markdownContent = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
platform: "${frontmatter.platform}"
url: "${frontmatter.url}"
${frontmatter.thumbnail ? `thumbnail: "${frontmatter.thumbnail}"` : ''}
publishDate: "${frontmatter.publishDate}"
tags: ${JSON.stringify(frontmatter.tags)}
${frontmatter.metrics ? `metrics: ${JSON.stringify(frontmatter.metrics)}` : ''}
featured: ${frontmatter.featured || false}
status: "${frontmatter.status}"
---

${post.content || `# ${post.title}

${post.description}

[View ${post.platform === 'linkedin' ? 'LinkedIn Post' : 'YouTube Video'}](${post.url})
`}`;

    // Save to GitHub if token is provided
    if (githubToken) {
      const content = btoa(unescape(encodeURIComponent(markdownContent)));
      
      const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOCIAL_MEDIA_PATH}/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Add social media post: ${post.title}`,
          content: content,
          branch: 'main'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${errorData.message || response.statusText}`);
      }

      console.log('Successfully created social media post on GitHub:', filename);
    } else {
      console.log('No GitHub token provided, would create social media post:', filename, markdownContent);
    }
    
    // Clear cache to force reload
    clearSocialMediaCache();
    
    return true;
  } catch (error) {
    console.error('Error creating social media post:', error);
    return false;
  }
};

// Update social media post
export const updateSocialMediaPost = async (slug: string, updates: Partial<SocialMediaPost>, githubToken?: string): Promise<boolean> => {
  try {
    if (!githubToken) {
      console.log('No GitHub token provided, would update social media post:', slug, updates);
      clearSocialMediaCache();
      return true;
    }

    // Get current post to get the SHA
    const currentPost = await getSocialMediaPostBySlug(slug);
    if (!currentPost || !currentPost.sha) {
      throw new Error(`Post ${slug} not found or missing SHA`);
    }

    // Merge updates with current post
    const updatedPost = { ...currentPost, ...updates };
    const filename = `${slug}.md`;
    
    const frontmatter: SocialMediaFrontmatter = {
      title: updatedPost.title,
      description: updatedPost.description,
      platform: updatedPost.platform,
      url: updatedPost.url,
      thumbnail: updatedPost.thumbnail,
      publishDate: updatedPost.publishDate,
      tags: updatedPost.tags,
      metrics: updatedPost.metrics,
      featured: updatedPost.featured,
      status: updatedPost.status
    };
    
    const markdownContent = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
platform: "${frontmatter.platform}"
url: "${frontmatter.url}"
${frontmatter.thumbnail ? `thumbnail: "${frontmatter.thumbnail}"` : ''}
publishDate: "${frontmatter.publishDate}"
tags: ${JSON.stringify(frontmatter.tags)}
${frontmatter.metrics ? `metrics: ${JSON.stringify(frontmatter.metrics)}` : ''}
featured: ${frontmatter.featured || false}
status: "${frontmatter.status}"
---

${updatedPost.content || `# ${updatedPost.title}

${updatedPost.description}

[View ${updatedPost.platform === 'linkedin' ? 'LinkedIn Post' : 'YouTube Video'}](${updatedPost.url})
`}`;

    const content = btoa(unescape(encodeURIComponent(markdownContent)));
    
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOCIAL_MEDIA_PATH}/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Update social media post: ${updatedPost.title}`,
        content: content,
        sha: currentPost.sha,
        branch: 'main'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GitHub API error: ${errorData.message || response.statusText}`);
    }

    console.log('Successfully updated social media post on GitHub:', filename);
    
    // Clear cache to force reload
    clearSocialMediaCache();
    
    return true;
  } catch (error) {
    console.error('Error updating social media post:', error);
    return false;
  }
};

// Delete social media post
export const deleteSocialMediaPost = async (slug: string, githubToken?: string): Promise<boolean> => {
  try {
    if (!githubToken) {
      console.log('No GitHub token provided, would delete social media post:', slug);
      clearSocialMediaCache();
      return true;
    }

    // Get current post to get the SHA
    const currentPost = await getSocialMediaPostBySlug(slug);
    if (!currentPost || !currentPost.sha) {
      throw new Error(`Post ${slug} not found or missing SHA`);
    }

    const filename = `${slug}.md`;
    
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SOCIAL_MEDIA_PATH}/${filename}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Delete social media post: ${currentPost.title}`,
        sha: currentPost.sha,
        branch: 'main'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GitHub API error: ${errorData.message || response.statusText}`);
    }

    console.log('Successfully deleted social media post from GitHub:', filename);
    
    // Clear cache to force reload
    clearSocialMediaCache();
    
    return true;
  } catch (error) {
    console.error('Error deleting social media post:', error);
    return false;
  }
};