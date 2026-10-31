# Client repository guidance

- This is an independent React and TypeScript repository using Vite and npm, not Java or Gradle.
- Use Node.js 22 or newer and npm 10 or newer. Vite 6 and Vitest 4 support the installed Node.js 22.11.
- Application code belongs in `src/`; keep component tests alongside components.
- Use Vitest and React Testing Library. Shared test setup is `src/test/setup.ts`.
- Run commands from this repository's development worktree.
- Install locked dependencies: `npm ci`. Keep `package-lock.json` tracked.
- Full verification: `npm run check` (typecheck, production build, and tests).
- Production build: `npm run build`.
- Full test suite: `npm test`.
- Single test file: `npm test -- src/App.test.tsx`.
- Development server: `npm run dev`.
- The hello prototype fetches `GET /api/hello`; the Vite dev server proxies `/api` to `http://127.0.0.1:8080`. Start the server separately with `./gradlew run` from its development worktree.
- Test API success, loading, failure, and retry behavior; do not replace server-provided content with a hardcoded client greeting.
