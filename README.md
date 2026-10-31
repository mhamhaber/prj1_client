# client

The client is a React and TypeScript application using Vite and npm.
The original Java/Gradle scaffold has been removed.

The React implementation currently lives in the `dev` worktree, pending a merge
into `main`. From this main checkout:

```sh
cd ../../worktrees/client/dev
npm ci
npm run check
npm run dev
```

Requires Node.js 22+ and npm 10+. See the development worktree's README for
instructions on connecting to the Java server.
