# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/fc6f2802-2f2a-46f8-9087-1cd2c337a3dc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fc6f2802-2f2a-46f8-9087-1cd2c337a3dc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
\n+## Blog & CMS (Decap) Setup\n+\n+This project now includes a Git-based blog powered by **Decap CMS** (file-backed Markdown in `src/posts`).\n+\n+### Authoring Flow\n+1. Navigate to `/admin/` (Netlify deploy) and log in via Netlify Identity (invite-only).\n+2. Create or edit posts (collection: Blog Posts).\n+3. Publish – a commit is pushed to `main`, triggering a Netlify rebuild.\n+4. The site rebuild includes the new Markdown; the `/blog` index updates automatically.\n+\n+### Post Structure\n+Each post is a Markdown file with frontmatter:\n+\n+```md\n+---\n+title: "Post Title"\n+slug: "post-title"\n+date: 2025-01-01T12:00:00.000Z\n+tags:\n+  - tag1\n+  - tag2\n+excerpt: "Optional custom excerpt (else auto-generated)."\n+---\n+\n+Markdown content here...\n+```\n+\n+### Adding Fields\n+Edit `public/admin/config.yml` under the `collections: posts: fields` array. After committing, new fields appear in the CMS. Remember to update TypeScript types in `src/lib/posts.ts` if they are used at runtime.\n+\n+### Local Development\n+Install dependencies then run dev server:\n+```sh\n+npm install\n+npm run dev\n+```\n+Visit `http://localhost:5173/blog` for the list. The CMS at `http://localhost:5173/admin/` loads but authentication only works after deploying to Netlify with Identity + Git Gateway enabled. (Optional) You can run a local backend with `npx decap-server` and set `local_backend: true` (already enabled) to bypass auth locally.\n+\n+### Netlify Configuration Steps\n+1. Deploy repo to Netlify (link GitHub repo).\n+2. In Netlify dashboard: Enable Identity, set registration to Invite Only.\n+3. Enable Git Gateway (Identity > Services).\n+4. Invite your email (Identity > Invite Users). Accept invitation.\n+5. Update `site_url` in `public/admin/config.yml` with the deployed URL and commit.\n+6. (Optional) Add a `_redirects` file if needed to ensure SPA routing, though Vite + Netlify usually works automatically.\n+\n+### Styling\n+Markdown content uses Tailwind Typography (`prose dark:prose-invert`). Customize in `tailwind.config.ts` if desired.\n+\n+### Utilities\n+`src/lib/posts.ts` loads & caches Markdown at build time using `import.meta.glob` with `gray-matter` for frontmatter and `react-markdown` for rendering.\n+\n+### Future Enhancements\n+- Add SEO meta tags based on post frontmatter.\n+- Add tag filtering UI on `/blog`.\n+- Implement search (client-side fuse.js).\n+- Preview templates inside CMS (register in `public/admin/index.html`).\n+\n+---\n+Original README content continues below.\n*** End Patch

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/fc6f2802-2f2a-46f8-9087-1cd2c337a3dc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
