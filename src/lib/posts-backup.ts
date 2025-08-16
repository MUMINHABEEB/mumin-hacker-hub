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

// Try to load markdown files using glob
let markdownModules: Record<string, string> = {};

try {
  // Use the correct Vite glob syntax
  const modules = import.meta.glob("../posts/*.md", { 
    eager: true,
    query: '?raw',
    import: 'default'
  });
  
  console.log('[Blog] Glob results:', Object.keys(modules));
  console.log('[Blog] Loaded files count:', Object.keys(modules).length);
  
  markdownModules = modules as Record<string, string>;
  
  if (Object.keys(markdownModules).length > 0) {
    console.log('[Blog] Sample content preview:', Object.values(markdownModules)[0]?.slice(0, 200));
  }
  
} catch (e) {
  console.warn('[Blog] Could not load markdown files via glob:', e);
}

// Fallback posts for development and demo
const FALLBACK_POSTS: Post[] = [
  {
    title: "Cybersecurity From My Perspective",
    slug: "cybersecurity-from-my-perspective",
    date: "2025-08-16T09:18:00.000Z",
    tags: ["Cybersecurity", "InfoSec", "CloudSecurity", "PhishingAwareness", "SOCAnalysis"],
    excerpt: "Learn practical cybersecurity tips, cloud security basics, and how to stay safe online from a tech enthusiast's perspective.",
    content: `🔐 Cybersecurity From My Perspective

Cybersecurity is something I've been learning and paying attention to because it's not just a tech buzzword anymore — it's part of our daily life. From emails to cloud storage, everything around us is connected, and that also means everything can be attacked.

What I've learned so far is that **cybersecurity isn't just about tools, it's about awareness**. Even if you don't know how to use advanced hacking techniques or complicated defense systems, just being aware of threats already gives you a strong advantage.

🕵️ Types of Threats I've Noticed

1. Phishing – Fake emails or websites that trick you into giving your passwords.
2. Weak Passwords – People still use \`123456\` or \`password\`. Hackers love that.
3. Open Ports – If your system has unnecessary open ports, it's like leaving your door unlocked.
4. Social Engineering – Hackers don't always break in with code, sometimes they just trick people.

☁️ Cybersecurity & the Cloud

Since a lot of services are now cloud-based, I realized that security has shifted. It's not just about protecting your PC anymore, but also about protecting data on platforms like AWS, Google Cloud, or Microsoft Azure. Cloud security is huge because businesses depend on it daily.

🛡️ Basic Practices I Follow

* Never click random links.
* Use strong, unique passwords.
* Keep software updated.
* Double-check websites before entering sensitive info.
* Learn continuously — because threats keep evolving.

🚀 Why I Care About This

For me, cybersecurity is not only about protecting systems but also about protecting **trust**. If someone loses their money or data, it's not just a technical issue, it's an emotional one too. That's why I'm motivated to learn more — whether it's SOC analysis, penetration testing, or cloud security.

---

👉 This is not a complete cybersecurity guide. It's just what I know and practice right now. As I learn more, I'll share more.`
  },
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
  }
];

let cached: Post[] | null = null;

export function loadPosts(): Post[] {
  if (cached) return cached;
  
  const posts: Post[] = [];
  
  console.log('[Blog] Starting loadPosts...');
  console.log('[Blog] markdownModules keys:', Object.keys(markdownModules));
  
  // First, try to load from actual markdown files
  if (Object.keys(markdownModules).length > 0) {
    console.log('[Blog] Loading from markdown files');
    Object.entries(markdownModules).forEach(([path, raw]) => {
      try {
        const { data, content } = matter(raw);
        const fm = data as Partial<PostFrontmatter>;
        if (fm.title && fm.slug && fm.date) {
          const excerpt = fm.excerpt || content.replace(/[#>*_`\-]/g, "").slice(0, 160).trim();
          posts.push({ 
            title: fm.title, 
            slug: fm.slug, 
            date: fm.date, 
            tags: fm.tags || [], 
            excerpt, 
            content 
          });
        }
      } catch (e) {
        console.error('Failed to parse markdown file', path, e);
      }
    });
  } else {
    console.log('[Blog] No markdown files found via glob');
  }
  
  // If no markdown files loaded, use fallback posts
  if (posts.length === 0) {
    console.log('[Blog] Using fallback posts, count:', FALLBACK_POSTS.length);
    posts.push(...FALLBACK_POSTS);
  }
  
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cached = posts;
  
  console.log('[Blog] Final posts loaded:', posts.length);
  
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__BLOG_POSTS__ = posts;
    console.info('[Blog] Final loaded posts:', posts.map(p => p.slug));
    console.info('[Blog] Posts length:', posts.length);
  }
  
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  const all = loadPosts();
  const p = all.find(p => p.slug === slug);
  if (!p) {
    console.warn(`[Blog] Post not found for slug "${slug}". Available:`, all.map(x => x.slug));
  }
  return p;
}
