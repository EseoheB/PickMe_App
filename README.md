# PickMe

PickMe connects people by career type (Actor, Musician, Software Engineer, Cinematographer, Director, Gaffer, Camera Man, Music Producer, Director of Photography, and more) so they can discover each other's work and book paid 1:1 video sessions — "Picks" — with secure file sharing and an in-app balance for handling payouts.

**Live app:** https://pickme-app-navy.vercel.app

## What you can do

- **Sign up / sign in** and set up a profile with a unique username, profile photo, bio, and one or more professions.
- **Browse the General Feed**, filtered by career-type tabs, and search users or career types.
- **Visit a user's profile**, follow them, and view their posts by career tab.
- **Get Picked**: request or accept a paid 1:1 video session.
  - Pick Plus subscribers ($50/month) pay $10 per session and keep 80% of what they earn.
  - Non-subscribers can still get Picked for $5 and keep $3.
  - The Picker gets instant access to your PickMe page once Picked.
  - You have 48 hours to respond to a Pick request before the payment reverses to the Picker's Vault.
  - Sessions can be password-protected and stay open until the host ends them.
- **During a Pick**: video call with mute/camera controls, a countdown timer, live comments, and the option to minimize the call into the workspace.
- **Vault**: shared file storage (docs, media) that can't be downloaded without the uploader's approval, plus a group workspace chat.
- **Settings**: manage profile settings, notification and auto-accept preferences, your Pick-Plus subscription, and your Bank balance and transaction history.

## Tech stack

- [React 19](https://react.dev/) + [React DOM 19](https://react.dev/)
- [Vite 8](https://vite.dev/) with [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react)
- [Tailwind CSS v4](https://tailwindcss.com/) via the [`@tailwindcss/vite`](https://github.com/tailwindlabs/tailwindcss/tree/main/packages/%40tailwindcss-vite) plugin (no separate Tailwind/PostCSS config needed)
- [TypeScript 5.7](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/) as the package manager
- [oxfmt](https://github.com/oxc-project/oxfmt) for formatting

## Project structure

- [src/main.tsx](src/main.tsx) — React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into `#root`
- [src/App.tsx](src/App.tsx) — The entire app: screen router plus every screen (Sign-up, Profile Setup, Profession Select, Feed, User Profile, Picked, Vault, Settings)
- [src/index.css](src/index.css) — Global CSS entrypoint and Tailwind CSS v4 import
- [index.html](index.html) — Vite HTML shell containing the `#root` element
- [src/imports/](src/imports/) — Original Figma Make design reference assets (screenshots and the source design spec PDF)
- [vite.config.ts](vite.config.ts) — Vite configuration (React, Tailwind CSS v4, and the `@` alias for `src`)
- [package.json](package.json) — Dependencies and scripts

## Getting started

Requires [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:8443` by default, with hot reload on source changes.

### Other scripts

```bash
pnpm build     # type-check and produce a production build in dist/
pnpm preview   # preview the production build locally
pnpm format    # format the codebase with oxfmt
```

## Deployment

The app is a static Vite build (no backend), deployed to [Vercel](https://vercel.com/):

```bash
vercel --prod
```

## Current state

All data (posts, profiles, balances, transactions, vault files) is mock, in-memory state defined directly in [src/App.tsx](src/App.tsx) — there is no backend, authentication, or persistence yet. This is a working front-end prototype matching the original PickMe UI design spec.
