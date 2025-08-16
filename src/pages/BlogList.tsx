import { Link } from "react-router-dom";
import { loadPosts } from "@/lib/posts";
import { format } from "date-fns";
import { ChevronRight, Home } from "lucide-react";
import BlogLayout from "@/components/BlogLayout";

const BlogList = () => {
  const posts = loadPosts();
  return (
    <BlogLayout>
      <div className="container py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="flex items-center hover:text-primary transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Blog</span>
        </nav>
        
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        {posts.length === 0 && (
          <p className="text-muted-foreground">No posts yet. Create one in the CMS at <code>/admin</code>.</p>
        )}
        {posts.length > 0 && (
          <ul className="space-y-10">
            {posts.map(post => (
              <li key={post.slug} className="border-b border-border pb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
                </h2>
                <div className="text-sm text-muted-foreground mb-3 flex gap-3 flex-wrap">
                  <time dateTime={post.date}>{format(new Date(post.date), "PPP")}</time>
                  {post.tags?.map(t => (
                    <span key={t} className="rounded bg-accent/30 px-2 py-0.5 text-xs uppercase tracking-wide">{t}</span>
                  ))}
                </div>
                <p className="text-muted-foreground max-w-2xl">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="text-primary mt-3 inline-block hover:underline">Read more →</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogList;
