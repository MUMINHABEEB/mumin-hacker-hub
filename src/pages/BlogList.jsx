import { Link } from "react-router-dom";
import { loadPosts } from "@/lib/posts";
import BlogLayout from "@/components/BlogLayout";
import { format } from "date-fns";

const BlogList = () => {
  console.log('[BlogList] Component rendering...');
  const posts = loadPosts();
  console.log('[BlogList] Posts loaded:', posts.length);
  console.log('[BlogList] Posts:', posts);
  return (
    <BlogLayout>
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-foreground">Blog</h1>
      {posts.length === 0 && (
        <div className="text-muted-foreground space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base">No posts loaded. Debug info below:</p>
          <ul className="text-xs font-mono bg-muted/30 p-3 sm:p-4 rounded border border-border overflow-x-auto">
            <li><strong>window.__BLOG_POSTS__ length:</strong> {typeof window !== 'undefined' && window.__BLOG_POSTS__ ? window.__BLOG_POSTS__.length : 'n/a'}</li>
            <li><strong>Expected file:</strong> src/posts/hello-world.md</li>
            <li><strong>Did you restart dev server after adding markdown?</strong></li>
          </ul>
          <p className="text-sm sm:text-base">Create one in the CMS at <code>/admin</code> (after Netlify deploy) or ensure <code>hello-world.md</code> exists locally.</p>
        </div>
      )}
      {posts.length > 0 && (
        <ul className="space-y-6 sm:space-y-10">
          {posts.map(post => (
            <li key={post.slug} className="border-b border-border pb-4 sm:pb-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">
                <Link to={`/blog/${post.slug}`} className="hover:underline hover:text-primary">{post.title}</Link>
              </h2>
              <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 flex flex-col sm:flex-row sm:gap-3 sm:flex-wrap gap-1 sm:items-center">
                <time dateTime={post.date}>{format(new Date(post.date), "PPP")}</time>
                {post.tags?.length > 0 && (
                  <>
                    {post.tags.length > 0 && <span className="hidden sm:inline">•</span>}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {post.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-accent/30 text-xs uppercase tracking-wide">{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p className="text-muted-foreground max-w-2xl text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="text-primary text-sm sm:text-base inline-block hover:underline">Read more →</Link>
            </li>
          ))}
        </ul>
      )}
  </div>
  </BlogLayout>
  );
};

export default BlogList;
