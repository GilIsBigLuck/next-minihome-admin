# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a Next.js 16 admin panel using React 19, TypeScript, and the App Router.

### Key Layers

- **app/** - Pages using App Router. Server components by default, "use client" for interactivity.
- **components/ui/** - Reusable UI components with CVA (class-variance-authority) for type-safe variants
- **components/layout/** - Layout components (MainLayout, Header, Sidebar)
- **lib/api/** - API client functions with typed request/response interfaces
- **lib/providers/** - React Query provider configuration

### Data Fetching Pattern

React Query (TanStack) is used throughout:
- QueryProvider wraps the app with 60s staleTime
- Use `useQuery` for data fetching with query keys like `['users', filters, search]`
- Use `useMutation` for auth actions (login/register)

### API Layer

All API calls go through `lib/api/`. Base URL: `https://api.minihome.page/api`
- Token-based auth (Bearer token from localStorage)
- Check for 401 responses and redirect to login

### Styling Conventions

- **Tailwind CSS 4** with custom config in `app/globals.css`
- **CVA pattern** for all components - variants defined with `cva()` function
- **Design system**: High-contrast B&W palette, sharp 4px offset shadows
- **Material Icons**: Loaded via CDN, use class `material-symbols-outlined`
- Use `clsx()` for conditional class composition

### Import Alias

Use `@/` for imports from project root (e.g., `@/components/ui`).

## Component Patterns

Components export via index files. Props extend HTML attributes + CVA variants:

```typescript
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  icon?: string;
}
```
