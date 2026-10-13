When I load Clerk, the following issues appears: Clerk - DEPRECATION WARNING:
"createRouteMatcher" is deprecated and will be removed in the next major
release. Use resource-based auth checks instead. Move auth checks into each
page, layout, API route, or Server Function that accesses protected data.
Middleware-based auth checks rely on path matching, which can diverge from how
Next.js routes requests and leave protected resources reachable. For a migration
guide, see:
https://clerk.com/docs/guides/development/upgrading/upgrade-guides/migrate-from-create-route-matcher
Attention: Clerk collects telemetry data from its SDKs when connected to
development instances. The data collected is used to inform Clerk's product
roadmap. To learn more, including how to opt-out from the telemetry program,
visit: https://clerk.com/docs/telemetry.

GET / 307 in 991ms (next.js: 326ms, proxy.ts: 23ms, application-code: 642ms) GET
/editor 200 in 2.8s (next.js: 2.3s, proxy.ts: 19ms, application-code: 493ms)
[browser] Clerk: Clerk has been loaded with development keys. Development
instances have strict usage limits and should not be used when deploying your
application to production. Learn more:
https://clerk.com/docs/deployments/overview
(https://quality-tuna-44.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js:12:6133)
[browser] [Clerk UI] Component renderer did not mount within 10s. Common causes:
a failed chunk load, a dev-server misconfiguration (e.g. unresolved
lazy-compilation proxy), or a ClerkProvider/mountX call before the page is
hydrated. Check the Network tab for stalled or empty requests. at <unknown>
(https://quality-tuna-44.clerk.accounts.dev/npm/@clerk/ui@1/dist/ui.browser.js:1:11457)
(https://quality-tuna-44.clerk.accounts.dev/npm/@clerk/ui@1/dist/ui.browser.js:1:11457)
Clerk - DEPRECATION WARNING: "createRouteMatcher" is deprecated and will be
removed in the next major release. Use resource-based auth checks instead. Move
auth checks into each page, layout, API route, or Server Function that accesses
protected data. Middleware-based auth checks rely on path matching, which can
diverge from how Next.js routes requests and leave protected resources
reachable. For a migration guide, see:
https://clerk.com/docs/guides/development/upgrading/upgrade-guides/migrate-from-create-route-matcher
GET /editor 200 in 8.8s (next.js: 13ms, proxy.ts: 8.7s, application-code: 107ms)
[browser] Clerk: Clerk has been loaded with development keys. Development
instances have strict usage limits and should not be used when deploying your
application to production. Learn more:
https://clerk.com/docs/deployments/overview
(https://quality-tuna-44.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js:12:6133)
POST /editor 200 in 130ms (next.js: 10ms, proxy.ts: 52ms, application-code:
68ms) └─ ƒ invalidateCacheAction() in 10ms
node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js [browser]
Failed to fetch RSC payload for http://localhost:3000/. Falling back to browser
navigation. TypeError: Failed to fetch
