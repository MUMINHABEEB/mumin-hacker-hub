import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import getProject from "./tools/get-project";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import listAchievements from "./tools/list-achievements";
import listSocialPosts from "./tools/list-social-posts";

export default defineMcp({
  name: "mumin-hacker-hub",
  title: "mumin-hacker-hub",
  version: "0.1.0",
  instructions:
    "Read-only access to Mumin Habeeb's portfolio site. Use `list_projects` and `get_project` for cybersecurity and development projects, `list_blog_posts` and `get_blog_post` for writing, `list_achievements` for certifications and awards, and `list_social_posts` for social activity. Only published, publicly visible content is exposed.",
  tools: [listProjects, getProject, listBlogPosts, getBlogPost, listAchievements, listSocialPosts],
});
