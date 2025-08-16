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

// Hardcoded posts as a temporary solution
const HARDCODED_POSTS: Post[] = [
  {
    title: "Hello World",
    slug: "hello-world", 
    date: "2025-08-16T10:00:00.000Z",
    tags: ["intro", "welcome"],
    excerpt: "A first post to confirm the blog pipeline works with Decap CMS + Vite.",
    content: `Welcome to your new blog! This **markdown** file lives in \`src/posts/\` and is loaded at build time using \`import.meta.glob\`.

## Features

- Written in Markdown
- Parsed with gray-matter
- Rendered with react-markdown
- Frontmatter drives title, date, tags, slug & excerpt

Update or delete this post once you publish your own content from the CMS at \`/admin\`.`
  },
  {
    title: "Test Post - Deployment Check",
    slug: "test-deployment",
    date: "2025-08-16T15:00:00.000Z", 
    tags: ["test", "deployment"],
    excerpt: "Testing if changes actually deploy to the live website",
    content: `# This is a Test Post

If you can see this on the live website, then the deployment is working!

**Current time: August 16, 2025 - 3:00 PM**`
  },
  {
    title: "Cybersecurity From My Perspective",
    slug: "cybersecurity-from-my-perspective",
    date: "2025-08-16T09:18:00.000Z",
    tags: ["Cybersecurity", "InfoSec", "CloudSecurity", "PhishingAwareness", "SOCAnalysis", "PenetrationTesting", "CyberAwareness"],
    excerpt: "Learn practical cybersecurity tips, cloud security basics, and how to stay safe online from a tech enthusiast's perspective.",
    content: `# Cybersecurity From My Perspective - UPDATED VERSION

**🚨 TEST UPDATE: This should appear on the live website! 🚨**

As a cybersecurity enthusiast transitioning from accounting to the world of digital defense, I've gained unique insights into how businesses and individuals can protect themselves in our increasingly connected world.

## The Reality of Modern Threats

Every day, we face sophisticated cyber threats that can compromise our personal data, financial information, and digital identity. From my experience working with financial systems, I've seen firsthand how vulnerable organizations can be without proper security measures.

## Essential Cybersecurity Practices

### 1. Strong Password Management
- Use a unique, complex password for every account
- Enable two-factor authentication (2FA) wherever possible
- Consider using a reputable password manager

### 2. Email Security
- Be cautious of suspicious emails and attachments
- Verify sender identity before clicking links
- Use encrypted email services when handling sensitive information

### 3. Cloud Security Basics
- Regularly review and update privacy settings
- Use encryption for sensitive data storage
- Implement proper access controls

## My Learning Journey

Currently pursuing BCA in Cloud and Security, I'm constantly expanding my knowledge in:
- **SOC Analysis**: Understanding how to monitor and respond to security incidents
- **Penetration Testing**: Learning ethical hacking techniques to identify vulnerabilities
- **Cloud Security**: Mastering secure cloud infrastructure management

## Practical Tips for Everyone

1. **Keep Software Updated**: Regular updates patch security vulnerabilities
2. **Backup Important Data**: Use the 3-2-1 backup rule (3 copies, 2 different media, 1 offsite)
3. **Be Social Media Aware**: Limit personal information sharing
4. **Use Secure Networks**: Avoid public WiFi for sensitive activities

## Conclusion

For me, cybersecurity is not only about protecting systems but also about protecting **trust**. If someone loses their money or data, it's not just a technical issue, it's an emotional one too. That's why I'm motivated to learn more — whether it's SOC analysis, penetration testing, or cloud security.

---

👉 This is not a complete cybersecurity guide. It's just what I know and practice right now. As I learn more, I'll share more.`
  }
];

console.log('[Blog] Using hardcoded posts as fallback');

// Cache for posts
let cached: Post[] | null = null;

export function loadPosts(): Post[] {
  if (cached) return cached;
  
  console.log('[Blog] Loading hardcoded posts...');
  console.log('[Blog] Posts count:', HARDCODED_POSTS.length);
  
  // Sort posts by date (newest first)
  const posts = [...HARDCODED_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  cached = posts;
  
  console.log('[Blog] Final posts loaded:', posts.length);
  console.log('[Blog] Post slugs:', posts.map(p => p.slug));
  
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__BLOG_POSTS__ = posts;
    console.info('[Blog] Posts available in window.__BLOG_POSTS__');
  }
  
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  console.log(`[Blog] Looking for post with slug: ${slug}`);
  const posts = loadPosts();
  const post = posts.find(p => p.slug === slug);
  console.log(`[Blog] Found post:`, post ? post.title : 'not found');
  return post;
}
