# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Liveblocks setup complete

## Current Goal

- Implement the next feature specification.

## Completed

- Design system: configured shadcn/ui with Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives.
- Dark theme: established Ghost AI CSS tokens, Tailwind token mappings, Geist font usage, and dark-only rendering.
- Shared utility: added `cn()` for Tailwind class merging and installed Lucide React.
- Editor chrome: added a controlled top navbar with sidebar toggle states and a floating, animated Projects sidebar with tabbed empty states and a New Project action.
- Editor layout: composed the navbar and project sidebar into a reusable client-side layout with shared sidebar state.
- Dialog pattern: confirmed the existing token-backed shadcn dialog supports title, description, and footer actions for a future dialog implementation.
- Authentication: added ClerkProvider with the dark theme and app-token appearance variables, minimal responsive sign-in and sign-up pages, session-aware root redirects, and protected-by-default routing through `proxy.ts`.
- Editor authentication: moved the editor entry point to `/editor` and added Clerk's built-in UserButton for profile settings and logout.
- Project dialogs: added the editor home prompt and create button, live slug preview, create/rename/delete dialogs, mock owned/shared project lists, owner-only sidebar actions, and mobile sidebar scrim dismissal.
- Prisma foundation: added the Project and ProjectCollaborator models, a development-cached Prisma client with Accelerate and PostgreSQL adapter branches, and the initial PostgreSQL migration. Generated Prisma Client and applied the migration successfully.
- Project APIs: added authenticated project list/create endpoints and owner-only rename/delete endpoints. Unauthenticated requests return 401, non-owner mutations return 403, missing projects return 404, and creation defaults the project name to `Untitled Project` while using the schema's cuid ID strategy.
- Editor workspace shell: moved the dynamic workspace route to `/editor/[roomId]`, added Clerk identity and owner/collaborator access helpers, redirected signed-out requests to `/sign-in`, and rendered an access-denied screen for unavailable rooms. The workspace now shows project context, highlights the active sidebar entry, and includes canvas and AI sidebar placeholders plus UI-only share and AI controls.
- Share dialog implementation: added workspace Share button and dialog, collaborator list with Clerk name/avatar enrichment and email fallback, owner-only invite/remove controls backed by authenticated APIs, read-only collaborator access, and temporary project-link copy feedback.
- Share-dialog verification: `npm run build` passes with the collaborator API routes included.
- Share-dialog UI refinement: increased dialog spacing, clarified the invite and access sections, and separated member rows and the project-link control into readable surfaces.
- Liveblocks setup: added shared presence and user metadata types, a cached server client, deterministic cursor colors, and a Clerk-authenticated room token route that checks project membership and creates private rooms as needed.
- Liveblocks setup verification: `npm run build` passes. Added `@liveblocks/node`, which was missing from the installed dependencies despite the spec's dependency note.
- Base collaborative canvas: replaced the workspace canvas placeholder with a client-side Liveblocks room wrapper and suspense-backed React Flow canvas. Added shared node color/shape and canvas node/edge types, loose connections, fit-to-view, minimap, and dot background.
- Base collaborative canvas verification: `npm run build` passes, including TypeScript checks.
- Shape panel: added a floating bottom-center toolbar with draggable icons for all six node shapes. Drag payloads include shape and default dimensions; dropping on the canvas converts screen coordinates and adds a collaborative `canvasNode` with an empty label and default color. Added a basic bordered rectangle renderer for the custom node type.
- Shape panel verification: `npm run build` passes with TypeScript checks.
- Shape panel provider fix: wrapped the React Flow canvas subtree in `ReactFlowProvider` so `useReactFlow` has the required context. `npm run build` passes.
- Canvas shape rendering fix: custom canvas nodes now render geometry based on their stored shape (rectangle, diamond, circle, pill, cylinder, or hexagon), so dropped nodes retain their individual appearance.

## In Progress

- None.

## Next Up

- Implement the next feature specification.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- A project's database ID is also its Liveblocks room ID. Editor-created projects use a slug plus a short random suffix; API callers without a supplied ID retain the Prisma cuid default.

## Session Notes

- Design-system, editor chrome, authentication, project-dialog, Prisma foundation, project API, editor-home wiring, editor workspace shell, share-dialog, Liveblocks setup, base collaborative canvas, and shape panel specifications are complete. Editor projects load server-side; project create, rename, delete, and workspace navigation use the API. `/editor/[roomId]` checks access before rendering and hosts a Liveblocks-backed React Flow canvas with draggable shape creation. Share APIs enforce membership for listing and ownership for mutations. Liveblocks access tokens are issued only after verifying membership for the project room. `npm run build` passes.
