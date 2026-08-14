import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { db, serialize, textResult } from "../mongo";

export default defineTool({
  name: "list_achievements",
  title: "List achievements",
  description:
    "List Mumin Habeeb's achievements, certifications and awards. Optionally filter to featured entries, a category, or a type such as 'certificate'.",
  inputSchema: {
    featured: z.boolean().optional().describe("Only return featured achievements."),
    category: z.string().optional().describe("Filter by achievement category."),
    type: z.string().optional().describe("Filter by achievement type, e.g. 'certificate'."),
    limit: z.number().int().min(1).max(100).optional().describe("Max entries to return (default 30)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ featured, category, type, limit }) => {
    // Never surface entries explicitly withheld from the public site.
    const filter: Record<string, unknown> = { published: { $ne: false } };
    if (featured) filter.featured = true;
    if (category) filter.category = category;
    if (type) filter.type = type;

    const docs = await (await db())
      .collection("achievements")
      .find(filter)
      .sort({ display_order: 1, created_at: -1 })
      .limit(limit ?? 30)
      .toArray();

    return textResult({ achievements: docs.map(serialize) });
  },
});
