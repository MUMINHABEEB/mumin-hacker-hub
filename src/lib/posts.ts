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
  // @ts-ignore
  const globA = import.meta.glob("../posts/*.md", { eager: true, query: '?raw', import: 'default' });
  // @ts-ignore  
  const globB = import.meta.glob("../posts/**/*.md", { eager: true, query: '?raw', import: 'default' });
  
  markdownModules = { ...globA, ...globB } as Record<string, string>;
  console.log('[Blog] Loaded markdown files:', Object.keys(markdownModules));
} catch (e) {
  console.warn('[Blog] Could not load markdown files via glob:', e);
}

// Fallback posts for development and demo
const FALLBACK_POSTS = [
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
    title: "Getting Started with the Blog",
    slug: "getting-started", 
    date: "2025-08-16T11:00:00.000Z",
    tags: ["tutorial", "guide"],
    excerpt: "Learn how to use this blog system and add your own content.",
    content: `This blog system is powered by:

- **Decap CMS** for content management
- **React** for the frontend
- **Vite** for fast development
- **Tailwind CSS** for styling

## Adding New Posts

### Method 1: CMS Interface (Recommended)
1. Deploy your site to Netlify
2. Enable Netlify Identity
3. Visit \`yoursite.netlify.app/admin\`
4. Login and create posts visually

### Method 2: Direct File Creation
1. Create \`.md\` files in \`src/posts/\`
2. Include proper frontmatter
3. Push to GitHub
4. Netlify rebuilds automatically

## Publishing Workflow

Your site uses **Git Gateway** which means:
- Posts created in CMS are saved as commits to GitHub
- Every commit triggers a new deployment
- Changes are live within 1-2 minutes`
  }
];

let cached: Post[] | null = null;

export function loadPosts(): Post[] {
  if (cached) return cached;
  
  const posts: Post[] = [];
  
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
  }
  
  // If no markdown files loaded, use fallback posts
  if (posts.length === 0) {
    console.log('[Blog] Using fallback posts');
    posts.push(...FALLBACK_POSTS);
  }
  
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cached = posts;
  
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
