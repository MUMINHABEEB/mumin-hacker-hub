import { useParams } from "react-router-dom";
import { getPostBySlug } from "@/lib/posts";
import BlogLayout from "@/components/BlogLayout";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) {
    return (
      <BlogLayout>
        <div className="container py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">Post not found</h1>
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">Slug: <code>{slug}</code></p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Open the browser console (F12) and look for logs beginning with [Blog]. They show which slugs were loaded. Ensure the file <code>src/posts/hello-world.md</code> exists and server restarted.</p>
          <a href="/blog" className="text-primary underline text-sm sm:text-base">Back to blog list</a>
        </div>
      </BlogLayout>
    );
  }
  return (
    <BlogLayout>
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-sm sm:prose-base lg:prose-lg">
        <h1 className="text-foreground text-2xl sm:text-3xl lg:text-4xl">{post.title}</h1>
        <p className="!mt-0 text-xs sm:text-sm text-muted-foreground">
          <time dateTime={post.date}>{format(new Date(post.date), "PPP")}</time>
          {post.tags && post.tags.length > 0 && (
            <span className="ml-2 sm:ml-3 inline-flex gap-1 sm:gap-2 flex-wrap">
              {post.tags.map(t => <span key={t} className="px-1.5 sm:px-2 py-0.5 rounded bg-accent/40 text-[10px] sm:text-xs font-medium tracking-wide uppercase text-foreground">{t}</span>)}
            </span>
          )}
        </p>
    <ReactMarkdown>{post.content || '*No content*'}</ReactMarkdown>
      </article>
  </div>
  </BlogLayout>
  );
};

export default BlogPost;
