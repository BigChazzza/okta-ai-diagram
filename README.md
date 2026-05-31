# Okta AI Diagram

An interactive web tool for visually explaining Okta's AI offering. Drag agents,
resources, and Okta identity components onto a canvas, draw arrows between
them, and label the connections to tell the architecture story.

## Live demo

Deploy this repo to Vercel — see [Deploy](#deploy) below.

## What you can do

- Drag any AI agent, resource, or Okta component from the sidebar onto the canvas.
- Connect nodes by dragging from one handle to another. Arrows are directional.
- **Double-click an arrow** to label it (e.g. "OAuth", "ID token", "introspect").
- **Toggle visibility** of an entire category from the sidebar (state preserved).
- **Delete** a node via the hover X, right-click → Delete, or Backspace.
- **Export / Import** your diagram as JSON to share with teammates.
- **Reset** to start over with the Okta logo at the center.
- **Light / Dark mode** toggle.

Diagrams persist automatically in your browser's `localStorage` — refresh and your
work is still there.

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build  # production build
npm run lint   # eslint
```

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [@xyflow/react](https://reactflow.dev/) (React Flow) for the diagram engine
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode
- [simple-icons](https://simpleicons.org/), [lucide-react](https://lucide.dev/)
- [Zod](https://zod.dev/) for diagram-file validation

## Deploy

The fastest path is Vercel:

1. Push this repo to GitHub.
2. Visit [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js. No env vars needed. Click **Deploy**.

Future pushes to `main` trigger production deploys; pull requests get preview URLs.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| Backspace / Delete | Delete selected node(s) or edge(s) |
| Drag from handle | Create an edge between two nodes |
| Double-click edge | Edit the edge label |
| Right-click node/edge | Open context menu (Delete / Edit label) |

## Browser support

This is a desktop-first tool. HTML5 drag-and-drop on iOS Safari is unreliable, so
the sidebar→canvas drag interaction does not work on iPad/iPhone.

## Trademarks

Brand names and logos are trademarks of their respective owners. This is an
unofficial illustrative diagramming tool and is not affiliated with or endorsed
by Anthropic, OpenAI, GitHub, Microsoft, or Okta. Logos are rendered through the
CC0-licensed [simple-icons](https://simpleicons.org/) project where available;
otherwise the tool falls back to a colored monogram tile.

## License

MIT — see [LICENSE](./LICENSE).
