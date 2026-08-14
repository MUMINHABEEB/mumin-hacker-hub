import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { db, serialize, textResult } from "../mongo";

export default defineTool({
  name: "get_project",
  title: "Get project",
  description:
    "Fetch one published portfolio project in full detail (description, technologies, features, links) by its slug or title.",
  inputSchema: {
    slug: z.string().trim().min(1).optional().describe("The project slug."),
    title: z.string().trim().min(1).optional().describe("The project title, matched case-insensitively."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, title }) => {
    if (!slug && !title) throw new ToolError("Provide either a slug or a title.");

    const filter: Record<string, unknown> = { published: { $ne: false } };
    if (slug) filter.slug = slug;
    else filter.title = { $regex: `^${title!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };

    const doc = await (await db()).collection("projects").findOne(filter);
    if (!doc) throw new ToolError("No published project matched that slug or title.");

    return textResult({ project: serialize(doc) });
  },
});
