import { useParams } from "react-router-dom";
import { getPostBySlug } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <NotFound />;
  return (
    <div className="container py-12">
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
  );
};

export default BlogPost;
