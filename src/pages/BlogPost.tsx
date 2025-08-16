import { useParams, Link } from "react-router-dom";
import { getPostBySlug } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";
import BlogLayout from "@/components/BlogLayout";

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <NotFound />;
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
          <time dateTime={post.date}>{format(new Date(post.date), "PPP")}</time>
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
