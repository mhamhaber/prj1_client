# Client repository guidance

- The client is a React and TypeScript project, not Java or Gradle.
- Active application code and build configuration are in the `dev` worktree at `../../worktrees/client/dev` until merged into `main`.
- Do not restore the Java scaffold or add a Gradle build.
- Follow the development worktree's `AGENTS.md` when editing or building the React application.
- From that worktree, install dependencies with `npm ci`, run full verification with `npm run check`, run all tests with `npm test`, and run a single test with `npm test -- src/App.test.tsx`.
- Start the client with `npm run dev`. It requires Node.js 22+ and npm 10+.
