import { Link } from "react-router-dom";
import { loadPosts, type Post } from "@/lib/posts";
import { format } from "date-fns";
import { ChevronRight, Home, RefreshCw } from "lucide-react";
import BlogLayout from "@/components/BlogLayout";
import { useState, useEffect } from "react";

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPostsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedPosts = await loadPosts();
      setPosts(loadedPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostsData();
  }, []);

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
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <button 
            onClick={loadPostsData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadPostsData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-muted-foreground">No posts yet. Create one using the <Link to="/github-admin" className="text-primary hover:underline">GitHub Admin</Link>.</p>
        )}

        {!loading && !error && posts.length > 0 && (
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
