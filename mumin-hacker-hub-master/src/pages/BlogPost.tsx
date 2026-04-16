import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ChevronRight, Home, ArrowLeft, RefreshCw } from "lucide-react";
import NotFound from "./NotFound";
import BlogLayout from "@/components/BlogLayout";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';

// Supabase blog post interface
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  publish_date?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Fetch blog post by slug from Supabase
        const { data: foundPost, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned
            setError('Post not found');
          } else {
            throw error;
          }
        } else if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error('Error loading post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <BlogLayout>
        <div className="container py-12">
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

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
        <Link to="/blog" className="hover:text-primary transition-colors">
          Blog
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Back to Blog Link */}
      <Link 
        to="/blog" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Blog
      </Link>
      
      <article className="prose dark:prose-invert max-w-none">
        <h1>{post.title}</h1>
        <p className="!mt-0 text-sm text-muted-foreground">
          <time dateTime={post.publish_date || post.created_at}>
            {format(new Date(post.publish_date || post.created_at), "PPP")}
          </time>
          {post.tags && post.tags.length > 0 && (
            <span className="ml-3 inline-flex gap-2 flex-wrap">
              {post.tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-accent/40 text-[10px] font-medium tracking-wide uppercase">{t}</span>)}
            </span>
          )}
        </p>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
    </BlogLayout>
  );
};

export default BlogPost;
