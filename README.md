# Startup-OS

This repository is a Vite + React + TypeScript project scaffolded with shadcn/ui utilities and a few Radix UI components. This README contains all steps you need to get the project running locally on macOS (zsh), run tests, linting, build, and common troubleshooting tips.

## Prerequisites

- Node.js: Recommended LTS (Node 18.x or Node 20.x). Vite 5 and TS 5 are compatible with Node 18+.
- npm (bundled with Node) or another package manager like pnpm/yarn (instructions below assume `npm`).
- Optional but recommended: nvm to manage Node versions on macOS/zsh.

## Quick setup (recommended)

1. Install nvm (optional but useful):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# load nvm for this session (you may need to reopen terminal / source your shell rc)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \ . "$NVM_DIR/nvm.sh"
```

2. Install and use an LTS Node version:

```bash
nvm install --lts
nvm use --lts

# verify
node -v
npm -v
```

3. (Optional) Create a `.nvmrc` file in the repo root so contributors use the same Node version:

```bash
echo "lts/*" > .nvmrc
```

## Install dependencies

From the repository root:

```bash
cd /Users/mac/Documents/Startup-OS
npm install
# or, if you prefer reproducible installs and have a lockfile: npm ci
```

Notes:
- There is no lockfile included in the snapshot. `npm install` will generate one. If you prefer `pnpm` or `yarn`, adapt accordingly (e.g. `pnpm install`).

## Run the development server

Start the Vite dev server:

```bash
npm run dev
```

Open your browser at: http://localhost:8080

Explanation: This project sets the Vite dev server to port 8080 in `vite.config.ts`:

```ts
// vite.config.ts excerpt
server: {
	host: "::",
	port: 8080,
	hmr: { overlay: false }
}
```

If port 8080 is in use, run with a different port:

```bash
npm run dev -- --port 3000
```

## Run tests

Unit tests use Vitest.

```bash
npm test          # run tests once
npm run test:watch # run tests in watch mode (interactive)
```

## Linting and type checking

```bash
npm run lint

# TypeScript check (no emit)
npx tsc --noEmit
```

## Build and preview (production)

```bash
npm run build
npm run preview
```

`npm run preview` serves the built `dist/` folder locally. Vite preview uses its own default port (commonly 5173) unless overridden.

## Environment variables

I did not find a project-level `.env` file or required env variables in the repo snapshot. If your app requires secrets or environment keys, create a `.env` or `.env.local` in the project root and ensure `.gitignore` excludes secrets.

## Troubleshooting

- Wrong Node version / runtime errors:
	- Use `nvm use` to switch to the recommended Node LTS.
- Dependencies fail to install / native build errors (M1 / Apple silicon):
	- Try `npm rebuild` or remove `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`.
- Vite dev server port conflict:
	- Either kill the process using the port or run `npm run dev -- --port <other-port>`.
- SWC or plugin errors:
	- This project uses `@vitejs/plugin-react-swc`. If you see errors about SWC binaries, ensure Node is compatible and try reinstalling dependencies.
- ESLint errors / TypeScript errors:
	- Run `npx tsc --noEmit` to see TS issues. Fix types or install missing `@types/*` packages.

## Useful scripts (from package.json)

- dev: `vite`
- build: `vite build`
- build:dev: `vite build --mode development`
- preview: `vite preview`
- lint: `eslint .`
- test: `vitest run`
- test:watch: `vitest`

## What I checked while writing this README

- `package.json` (scripts, dependencies, devDependencies)
- `vite.config.ts` (server port: 8080 and dev-only plugin usage)


