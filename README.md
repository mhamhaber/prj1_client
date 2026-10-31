# prj1_client

Independent React and TypeScript client using Vite, npm, and Vitest.

## Requirements

- Node.js 22 or newer and npm 10 or newer.
- Internet access to install dependencies.

Vite 6 and Vitest 4 support the workspace's installed Node.js 22.11.

## Commands

Run from this repository or one of its worktrees:

```sh
npm ci             # Install locked dependencies
npm run dev        # Start the local development server
npm run check      # Typecheck, production build, and all tests
npm run build      # Typecheck and build to dist/
npm test           # Run all tests once
npm test -- src/App.test.tsx  # Run a single test file
npm run test:watch # Watch tests during development
npm run preview    # Preview the production build locally
```

Application code is in `src/`; component tests sit beside their components.
Testing uses Vitest, React Testing Library, and jsdom. The initial page is a
hello-world prototype that loads its greeting content from the Java server.

## Server connection

Start the Java server in a separate terminal from `repos/prj1_server` with
`./gradlew run`. Then start this client with `npm run dev` and open the URL Vite
prints (normally `http://localhost:5173`). Vite proxies `/api` requests to
`http://127.0.0.1:8080`; adjust `vite.config.ts` if the server port changes.
The page includes loading, unavailable-server, and retry states.

The proxy applies to the development server, not the built `dist/` files or
`npm run preview`. A deployed setup must route `/api` to the Java server on the
same origin. Optional Google Fonts enhance the styling; system fonts are used
when they cannot load.
