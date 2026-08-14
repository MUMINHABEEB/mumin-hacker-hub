import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { db, serialize, textResult } from "../mongo";

export default defineTool({
  name: "list_social_posts",
  title: "List social posts",
  description:
    "List published social media posts shown on the site, optionally filtered to a single platform.",
  inputSchema: {
    platform: z.string().optional().describe("Filter by platform, e.g. 'linkedin', 'github', 'x'."),
    limit: z.number().int().min(1).max(50).optional().describe("Max posts to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ platform, limit }) => {
    const filter: Record<string, unknown> = { published: true };
    if (platform) filter.platform = { $regex: `^${platform}$`, $options: "i" };

    const docs = await (await db())
      .collection("socialmedias")
      .find(filter)
      .sort({ created_at: -1 })
      .limit(limit ?? 20)
      .toArray();

    return textResult({ posts: docs.map(serialize) });
  },
});
