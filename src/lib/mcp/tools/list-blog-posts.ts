import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { db, serialize, textResult } from "../mongo";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List published blog posts with their titles, slugs, excerpts and tags. Use get_blog_post to read the full body of one post.",
  inputSchema: {
    tag: z.string().optional().describe("Only return posts carrying this tag."),
    limit: z.number().int().min(1).max(50).optional().describe("Max posts to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ tag, limit }) => {
    const filter: Record<string, unknown> = { published: true };
    if (tag) filter.tags = tag;

    const docs = await (await db())
      .collection("blogposts")
      .find(filter, { projection: { content: 0 } })
      .sort({ created_at: -1 })
      .limit(limit ?? 20)
      .toArray();

    return textResult({ posts: docs.map(serialize) });
  },
});
