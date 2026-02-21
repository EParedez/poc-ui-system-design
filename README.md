# UI Platform

Monorepo for a shared UI system: design tokens, Web Components, optional headless logic, and thin framework adapters (Angular, React).

## Goal

- **Single source of truth:** Design tokens (`@org/design-tokens`) define colors, spacing, typography, etc.
- **Canonical UI:** Web Components in `@org/ui-core-wc` (Lit) are the primary implementation; they work in any framework or plain HTML.
- **Optional headless:** `@org/ui-core-headless` exposes behavior and a11y without UI or framework deps.
- **Thin adapters:** `@org/ui-angular`, `@org/ui-react` only wrap the Web Components and forward props/slots—no extra logic or styling.

See [GUIDELINES.md](./GUIDELINES.md) for principles, dependency rules, and contribution notes.

## How to run the project

**Requirements:** Node.js, [pnpm](https://pnpm.io/) (v9+).

From the **repository root**:

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Run Storybook** (develop and document components)
   ```bash
   pnpm --filter @org/ui-storybook storybook
   ```
   Opens at [http://localhost:6006](http://localhost:6006).

3. **Run a script in a specific package**
   ```bash
   pnpm --filter @org/<package-name> <script-name>
   ```
   Example: `pnpm --filter @org/ui-storybook storybook`

## Versioning and releases (Changesets)

- **Create a changeset** (after making changes you want to release):
  ```bash
  pnpm run changeset
  ```
  Choose affected packages and bump type (major / minor / patch).

- **Apply version bumps** (update versions and CHANGELOGs):
  ```bash
  pnpm run version-packages
  ```

- **Publish** to npm (after versioning):
  ```bash
  pnpm run release
  ```

Details: [.changeset/README.md](./.changeset/README.md) and the “Versioning and release” section in [GUIDELINES.md](./GUIDELINES.md).

## Important notes

- **Package manager:** Use **pnpm** only; do not use npm or yarn for installs in this repo.
- **Commands:** Run from the **repo root** unless a command or doc says otherwise.
- **New components:** Implement in `@org/ui-core-wc`, use design tokens, add stories in `@org/ui-storybook`, then add/update adapters (Angular, React) so the component is available everywhere.
- **Breaking changes:** Require a **major** version bump; use semver for all packages.
- **Full reference:** [GUIDELINES.md](./GUIDELINES.md) — dependency rules, styling, contribution, and package overview.
