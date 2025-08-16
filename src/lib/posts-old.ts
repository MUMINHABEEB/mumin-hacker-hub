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

// Dynamic posts storage (localStorage + GitHub integration)
const POSTS_STORAGE_KEY = 'blog-posts';

// Initial demo posts
const DEMO_POSTS: Post[] = [
  {
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog", 
    date: "2025-08-16T10:00:00.000Z",
    tags: ["intro", "welcome"],
    excerpt: "Welcome to my cybersecurity blog! Here I'll share insights, tutorials, and my learning journey.",
    content: `# Welcome to My Cybersecurity Blog!

I'm excited to share my journey in cybersecurity with you. This blog will cover:

## What You'll Find Here

- **Cybersecurity Insights**: Practical tips and best practices
- **Learning Journey**: My experiences pursuing BCA in Cloud and Security
- **Technical Tutorials**: Step-by-step guides for security tools
- **Industry News**: Analysis of current threats and trends

## About Me

I'm a cybersecurity enthusiast transitioning from accounting to digital defense. Currently pursuing BCA in Cloud and Security while building expertise in:

- SOC Analysis
- Penetration Testing
- Cloud Security
- Python Development

## Get Started

Use the Blog Admin panel to create and edit posts. You can:
- Write in Markdown
- Add tags for organization
- Set publish dates
- Create rich content with code blocks, links, and more

Let's build something amazing together! 🚀`
  },
  {
    title: "Getting Started with Cybersecurity",
    slug: "getting-started-cybersecurity",
    date: "2025-08-16T12:00:00.000Z", 
    tags: ["beginner", "cybersecurity", "guide"],
    excerpt: "Essential first steps for anyone interested in cybersecurity career.",
    content: `# Getting Started with Cybersecurity

Breaking into cybersecurity can seem overwhelming, but with the right approach, it's absolutely achievable. Here's your roadmap.

## 1. Build Strong Foundations

### Technical Skills
- **Networking**: Understand TCP/IP, DNS, firewalls
- **Operating Systems**: Get comfortable with Windows and Linux
- **Programming**: Learn Python, PowerShell, or bash scripting

### Soft Skills
- **Critical Thinking**: Analyze threats and solutions
- **Communication**: Explain technical concepts clearly
- **Continuous Learning**: Stay updated with evolving threats

## 2. Choose Your Path

### Popular Cybersecurity Roles
- **SOC Analyst**: Monitor and respond to security incidents
- **Penetration Tester**: Find vulnerabilities ethically
- **Security Engineer**: Design and implement security solutions
- **Incident Responder**: Handle security breaches

## 3. Get Hands-On Experience

### Home Labs
- Set up virtual machines
- Practice with security tools
- Simulate attack scenarios

### Certifications to Consider
- **CompTIA Security+**: Great starting point
- **CEH**: For ethical hacking
- **CISSP**: For advanced professionals

## 4. Stay Connected

- Join cybersecurity communities
- Attend conferences and meetups
- Follow security researchers on Twitter
- Read security blogs and news

Remember: Everyone starts somewhere. Focus on building one skill at a time, and don't be afraid to ask questions!`
  }
];

// Cache for posts
let cached: Post[] | null = null;

export function loadPosts(): Post[] {
  if (cached) return cached;
  
  console.log('[Blog] Loading posts...');
  
  // Try to load from localStorage first (user-created posts)
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      const parsed = JSON.parse(storedPosts) as Post[];
      console.log('[Blog] Loaded from localStorage:', parsed.length, 'posts');
      
      // Combine with demo posts, but prioritize stored posts
      const allPosts = [...parsed];
      
      // Add demo posts that don't exist in stored posts
      DEMO_POSTS.forEach(demoPost => {
        if (!allPosts.find(p => p.slug === demoPost.slug)) {
          allPosts.push(demoPost);
        }
      });
      
      // Sort by date (newest first)
      const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      cached = sortedPosts;
      
      console.log('[Blog] Final posts loaded:', sortedPosts.length);
      console.log('[Blog] Post slugs:', sortedPosts.map(p => p.slug));
      
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.__BLOG_POSTS__ = sortedPosts;
      }
      
      return sortedPosts;
    }
  } catch (e) {
    console.warn('[Blog] Failed to load from localStorage:', e);
  }
  
  // Fallback to demo posts
  console.log('[Blog] Using demo posts as fallback');
  const sortedPosts = [...DEMO_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cached = sortedPosts;
  
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__BLOG_POSTS__ = sortedPosts;
  }
  
  return sortedPosts;
}

export function getPostBySlug(slug: string): Post | undefined {
  console.log(`[Blog] Looking for post with slug: ${slug}`);
  const posts = loadPosts();
  const post = posts.find(p => p.slug === slug);
  console.log(`[Blog] Found post:`, post ? post.title : 'not found');
  return post;
}

// Add a new post
export function addPost(post: Post): void {
  console.log('[Blog] Adding new post:', post.title);
  
  try {
    const currentPosts = loadPosts();
    const updatedPosts = [post, ...currentPosts.filter(p => p.slug !== post.slug)];
    
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    cached = null; // Clear cache to force reload
    
    console.log('[Blog] Post added successfully');
  } catch (e) {
    console.error('[Blog] Failed to add post:', e);
    throw new Error('Failed to save post');
  }
}

// Update an existing post
export function updatePost(slug: string, updatedPost: Post): void {
  console.log('[Blog] Updating post:', slug);
  
  try {
    const currentPosts = loadPosts();
    const postIndex = currentPosts.findIndex(p => p.slug === slug);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    currentPosts[postIndex] = updatedPost;
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(currentPosts));
    cached = null; // Clear cache to force reload
    
    console.log('[Blog] Post updated successfully');
  } catch (e) {
    console.error('[Blog] Failed to update post:', e);
    throw new Error('Failed to update post');
  }
}

// Delete a post
export function deletePost(slug: string): void {
  console.log('[Blog] Deleting post:', slug);
  
  try {
    const currentPosts = loadPosts();
    const filteredPosts = currentPosts.filter(p => p.slug !== slug);
    
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
    cached = null; // Clear cache to force reload
    
    console.log('[Blog] Post deleted successfully');
  } catch (e) {
    console.error('[Blog] Failed to delete post:', e);
    throw new Error('Failed to delete post');
  }
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
