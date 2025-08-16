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
    title: "Cybersecurity From My Perspective",
    slug: "cybersecurity-from-my-perspective",
    date: "2025-08-16T09:18:00.000Z",
    tags: ["Cybersecurity", "InfoSec", "CloudSecurity", "PhishingAwareness", "SOCAnalysis", "PenetrationTesting", "CyberAwareness"],
    excerpt: "Learn practical cybersecurity tips, cloud security basics, and how to stay safe online from a tech enthusiast's perspective.",
    content: `# Cybersecurity From My Perspective

As a cybersecurity enthusiast transitioning from accounting to the world of digital defense, I've gained unique insights into how businesses and individuals can protect themselves in our increasingly connected world.

## The Reality of Modern Threats

Every day, we face sophisticated cyber threats that can compromise our personal data, financial information, and digital identity. From my experience working with financial systems, I've seen firsthand how vulnerable organizations can be without proper security measures.

## Essential Cybersecurity Practices

### For Individuals:
- **Strong Password Management**: Use unique passwords for each account
- **Two-Factor Authentication**: Enable 2FA wherever possible
- **Regular Software Updates**: Keep your systems patched and updated
- **Email Security**: Be cautious with attachments and links

### For Businesses:
- **Employee Training**: Regular cybersecurity awareness programs
- **Network Segmentation**: Isolate critical systems
- **Incident Response Planning**: Have a plan before you need it
- **Regular Security Audits**: Test your defenses regularly

## Cloud Security Considerations

As more businesses move to the cloud, understanding cloud security becomes crucial:

- **Identity and Access Management (IAM)**: Control who has access to what
- **Data Encryption**: Protect data both in transit and at rest
- **Compliance**: Understand regulatory requirements
- **Shared Responsibility Model**: Know what's your responsibility vs. the cloud provider's

## My Learning Journey

Currently pursuing my BCA in Cloud and Security, I'm hands-on learning about:

- **Penetration Testing**: Ethical hacking to find vulnerabilities
- **Python for Security**: Automating security tasks and analysis
- **SOC Operations**: Monitoring and responding to security incidents
- **Cloud Platforms**: Understanding AWS, Azure, and GCP security

## The Future of Cybersecurity

The cybersecurity landscape is constantly evolving. New threats emerge daily, but so do new defensive technologies. AI and machine learning are becoming powerful tools in both attack and defense scenarios.

## Key Takeaways

1. **Cybersecurity is everyone's responsibility** - not just the IT department
2. **Stay informed** about the latest threats and protection methods
3. **Implement layered security** - no single solution is foolproof
4. **Regular training and awareness** are as important as technical controls
5. **Plan for incidents** - assume breach mentality

## Connect and Learn Together

I'm always eager to connect with fellow cybersecurity enthusiasts, professionals, and anyone interested in staying safe online. Whether you're just starting your security journey or you're a seasoned professional, let's share knowledge and build a more secure digital world together.

---

*What cybersecurity challenges are you facing? Share your thoughts and let's discuss solutions in the comments below!*`
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
