import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { db, serialize, textResult } from "../mongo";

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description: "Read one published blog post in full, including its body content, by slug.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("The blog post slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const doc = await (await db()).collection("blogposts").findOne({ slug, published: true });
    if (!doc) throw new ToolError("No published blog post matched that slug.");
    return textResult({ post: serialize(doc) });
  },
});
