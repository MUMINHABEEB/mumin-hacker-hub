import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { db, serialize, textResult } from "../mongo";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List Mumin Habeeb's published portfolio projects, newest or display-order first. Optionally filter to featured projects or a category.",
  inputSchema: {
    featured: z.boolean().optional().describe("Only return featured projects."),
    category: z.string().optional().describe("Filter by project category."),
    limit: z.number().int().min(1).max(50).optional().describe("Max projects to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ featured, category, limit }) => {
    const filter: Record<string, unknown> = { published: { $ne: false } };
    if (featured) filter.featured = true;
    if (category) filter.category = category;

    const docs = await (await db())
      .collection("projects")
      .find(filter)
      .sort({ display_order: 1, created_at: -1 })
      .limit(limit ?? 20)
      .toArray();

    return textResult({ projects: docs.map(serialize) });
  },
});
