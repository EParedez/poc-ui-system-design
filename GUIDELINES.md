# UI Platform Guidelines

This document defines how packages in the UI platform relate to each other, how to use design tokens, and how to contribute. Follow these guidelines to keep the system consistent and maintainable.

---

## Important commands

All commands assume you are in the **repository root** unless noted. The workspace uses **pnpm** as the package manager.

### Setup

```bash
pnpm install
```

Installs dependencies for all workspace packages.

### Development

```bash
pnpm --filter @org/ui-storybook storybook
```

Starts Storybook on port 6006. Use this to develop and document Web Components and to run visual checks.

### Versioning and release (Changesets)

1. **Create a changeset** after making changes you want to release (describes the change and bump type):

   ```bash
   pnpm run changeset
   ```

   Follow the prompts to pick affected packages and bump type (major / minor / patch).

2. **Apply version bumps** (updates `package.json` versions and CHANGELOG from existing changesets):

   ```bash
   pnpm run version-packages
   ```

3. **Publish** to npm (only after versioning; use in CI or when cutting a release):

   ```bash
   pnpm run release
   ```

### Running a specific package script

To run a script defined in a single package:

```bash
pnpm --filter @org/<package-name> <script-name>
```

Examples:

- `pnpm --filter @org/ui-storybook storybook` — run Storybook
- `pnpm --filter @org/ui-core-wc build` — run the `build` script in `ui-core-wc` (if defined)

---

## Core Principles

### Design Tokens are the single source of truth

All visual decisions (colors, spacing, typography, radius, shadows) are defined once in **`@org/design-tokens`** and consumed everywhere else. Tokens are published as:

- **CSS variables** (`dist/css/variables.css`) for Web Components and global styles — e.g. `var(--color-primary)`.
- **Structured output** (e.g. JS/JSON) for build-time tools like Tailwind presets.

**Why:** Changing a brand color or spacing scale should require edits in one place. Components and adapters reference tokens only; they never invent their own values.

### Web Components are the primary UI delivery

**`@org/ui-core-wc`** is the canonical implementation of UI. Components are built with Lit, registered as custom elements (e.g. `<ui-button>`), and styled with CSS that uses design token variables.

**Why:** Web Components work in any framework and in plain HTML. Frameworks (Angular, React, etc.) use these same elements via thin adapters instead of reimplementing UI.

### Headless is isolated and optional

**`@org/ui-core-headless`** exposes logic and accessibility primitives (e.g. `useButton()` returning `role`, `tabIndex`) with **no** UI or framework. It does not depend on `ui-core-wc` or any adapter.

**Why:** Some products need only behavior (e.g. for custom designs or different tech stacks). Headless stays framework-agnostic and dependency-light so it can be used alone or alongside the WC layer.

### Adapters must be thin wrappers only

Framework packages (**`@org/ui-angular`**, **`@org/ui-react`**, etc.) exist only to:

- Render the corresponding Web Component (e.g. `<ui-button>`).
- Forward props/slots/content into that component.
- Satisfy framework-specific needs (e.g. Angular `ng-content`, React `children`).

They must **not** reimplement behavior, add business logic, or introduce their own styling. Example of a valid adapter: a component that renders `<ui-button><ng-content></ng-content></ui-button>` and nothing else.

**Why:** Logic and design live in one place (WC + tokens). Adapters stay trivial to maintain and don’t drift from the canonical implementation.

---

## Dependency Rules

- **`@org/ui-core-wc`**  
  - MUST NOT depend on any adapter (`ui-angular`, `ui-react`, etc.) or on headless.  
  - May depend on `lit` and design tokens (or consume tokens via CSS variables).

- **`@org/ui-core-headless`**  
  - MUST NOT depend on `ui-core-wc` or any adapter.  
  - No UI framework or WC dependency.

- **Adapters**  
  - Depend only on `@org/ui-core-wc` (and framework + build tooling).  
  - Must not add logic; they only wrap the WC and pass through props/slots.

This keeps a clear direction: tokens → WC (and optional headless); adapters → WC only.

---

## Versioning

- **Semver** is used for all packages (e.g. `0.1.0`).  
- **Breaking changes** (e.g. removing or renaming a component or token, changing public API) require a **major** version bump.  
- Non-breaking new features or fixes use minor/patch as appropriate.

---

## Styling

- **Colors, spacing, radius, typography, shadows** (and any other design decisions) come from **design tokens**.  
  - In WC: use CSS variables from `@org/design-tokens` (e.g. `var(--color-primary)`).  
  - In Tailwind (or similar): use the platform preset that maps theme keys to the same token variables.

- **No hardcoded values in components.**  
  - Avoid literal values like `#fff`, `6px`, `1rem` in component styles.  
  - If a value isn’t in the token system yet, add it to `@org/design-tokens` first, then reference it from the component or theme.

---

## Contribution

- **New components**  
  - Implement in `@org/ui-core-wc` using tokens.  
  - Add **Storybook stories** in `@org/ui-storybook` for every new component so it’s visible and documented.

- **Quality before release**  
  - Add **visual tests** (or equivalent) for changed or new UI before release so regressions are caught.

- **Adapters**  
  - When adding a new component to the platform, add or update the corresponding wrapper in each adapter (Angular, React, etc.) so the component is available in all supported frameworks.

---

## Quick reference

| Package               | Role                         | Depends on              |
|-----------------------|-----------------------------|--------------------------|
| `@org/design-tokens`  | Single source of truth for design | —                        |
| `@org/ui-core-wc`     | Canonical UI (Web Components)     | lit, tokens (via CSS)   |
| `@org/ui-core-headless` | Optional logic/a11y only      | —                        |
| `@org/ui-angular`     | Thin Angular wrappers around WC   | `@org/ui-core-wc`       |
| `@org/ui-react`       | Thin React wrappers around WC     | `@org/ui-core-wc`       |
| `@org/ui-storybook`   | Documentation and visual testing  | `@org/ui-core-wc`       |
| `@org/ui-tailwind`    | Tailwind theme from tokens        | `@org/design-tokens`    |
