# flydee - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for flydee.

### FILE: .env.example
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL=your_app_url_here

VITE_OPENSKY_USERNAME=your_opensky_username
VITE_OPENSKY_PASSWORD=[REDACTED_CREDENTIAL]
VITE_FIREBASE_API_KEY=
[REDACTED_CREDENTIAL]
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_FIRESTORE_ID=

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
APP_URL=http://localhost:3000

VITE_OPENSKY_USERNAME=commandert
VITE_OPENSKY_PASSWORD=[REDACTED_CREDENTIAL]

VITE_FIREBASE_API_KEY=[REDACTED_CREDENTIAL]
VITE_FIREBASE_AUTH_DOMAIN=flydee-e4046.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=flydee-e4046
VITE_FIREBASE_STORAGE_BUCKET=flydee-e4046.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=23530603425
VITE_FIREBASE_APP_ID=1:23530603425:web:ed46c86733fb42234341e0
VITE_FIREBASE_FIRESTORE_ID=(default)

```

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
firebase-applet-config.json

```

### FILE: CLAUDE.md
```md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This App Is

**Flydee** is a gamified plane-spotting PWA. Users point their phone camera at the sky; the app reads device orientation (compass heading + pitch) and GPS to match the camera vector against live OpenSky Network flight data, then lets users "capture" a matched aircraft as a collectible digital card stored in Firestore.

Three main views (bottom-tab navigation):
- **Viewfinder** — live camera + AR HUD, scans airspace every 10 s, locks target, fires capture. Loaded eagerly (always on first paint).
- **Flight Binder** (Collection) — Firestore card grid, filterable by rarity/callsign. Lazy-loaded.
- **Global Radar** (Map) — custom CSS radar that plots captured sightings relative to user position. Lazy-loaded.

Admin section at `/admin` (password-gated in-app, not Firebase auth-gated): dashboard, audit logs, diagnostics, testing panel. All admin components are lazy-loaded.

---

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Dev server on port 3000 (host 0.0.0.0)
pnpm run build        # Production build → dist/
pnpm run preview      # Preview production build
pnpm run lint         # TypeScript type-check (tsc --noEmit)
pnpm run clean        # Remove dist/
```

E2E tests use Playwright:
```bash
npx playwright test tests/e2e.spec.ts        # Run all E2E tests
npx playwright test tests/e2e.spec.ts --ui   # Interactive UI mode
```

---

## Environment Variables

Copy Firebase values from `firebase-applet-config.json`. Create `.env.local`:

```bash
VITE_FIREBASE_API_KEY=
[REDACTED_CREDENTIAL]
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_FIRESTORE_ID=      # Named Firestore database ID (not "(default)")

GEMINI_API_KEY=                   [REDACTED_CREDENTIAL]

# Optional — increases OpenSky rate limit from 10 req/min to 100/min
VITE_OPENSKY_USERNAME=
VITE_OPENSKY_PASSWORD=
[REDACTED_CREDENTIAL]

`vite.config.ts` uses `loadEnv(mode, '.')` (not `process.cwd()`) to pick up `.env.local`.

---

## Architecture

### Data Flow: Viewfinder capture

1. `useSensors()` (`src/lib/sensors.ts`) — wraps `navigator.geolocation.watchPosition` and `deviceorientation` events → emits `{ heading, pitch, location }`. iOS requires an explicit user gesture before orientation starts — call `startOrientation()` from a button handler.
2. `fetchNearbyFlights()` (`src/lib/flightApi.ts`) — calls OpenSky `/api/states/all` with a lat/lng bounding box. Client-side rate-limit: minimum 10 s between calls. Returns empty array if called too soon.
3. `findTargetAircraft()` (`src/lib/flightApi.ts`) — computes azimuth + elevation from user GPS to each flight using spherical trigonometry, then checks against device heading/pitch within a 20° tolerance window.
4. On capture: `AircraftCard` written to Firestore `cards` collection with `userId`, shown as a modal.

### Routing

`BrowserRouter` wraps the app in `src/main.tsx`. Two top-level routes in `App.tsx`:
- `/` — `AppContent` (tab-based: Viewfinder / Collection / Map)
- `/admin` — `AdminLayout` or `AdminLogin`, with sub-routes `dashboard`, `logs`, `diagnostics`, `testing`

`isAdmin` state lives in `App.tsx` (not persisted). Refreshing `/admin` resets to the login form.

Production is served under `base: '/flydee/'` (set in `vite.config.ts`) — all asset paths are prefixed.

### Code Splitting

`vite.config.ts` uses `rolldownOptions.output.manualChunks` (Vite 8 / Rolldown — not `rollupOptions`) to split vendors into named chunks: `vendor-firebase`, `vendor-motion`, `vendor-genai`, `vendor-react`. Collection, Map, and all admin components are `React.lazy()` with `<React.Suspense>` wrappers — they are not included in the initial bundle.

### Firebase / Firestore

- **Auth:** Google Sign-In via `signInWithPopup`. Auth state from `onAuthStateChanged` controls whether the login screen or main app renders.
- **Firestore:** Named database (ID from `VITE_FIREBASE_FIRESTORE_ID`). Schema canonical source: `firebase-blueprint.json`. Security rules: `firestore.rules`.
  - `cards/{cardId}` — owner CRUD, all authed users can read
  - `auditLogs/{logId}` — read-only from client; `allow write: if false`

### UI Components & Styling

shadcn/ui components live in **two locations**:
- `components/ui/` — root-level shadcn output directory (per `components.json`)
- `src/components/ui/` — what the app actually imports via the `@` alias

`@` resolves to `./src` (configured in both `vite.config.ts` and `tsconfig.json`). Add shadcn components with:
```bash
pnpm dlx shadcn@latest add <component>
```

Tailwind CSS v4 via `@tailwindcss/vite` plugin — **no `tailwind.config.js`**, config lives in `src/index.css`. Design language: dark/monochrome, `font-mono`, uppercase `tracking-widest` labels, zinc palette. Animations via `motion/react` (Framer Motion).

### Known Stubs in Viewfinder.tsx

Aircraft type, airline, origin, and destination are hardcoded stubs — OpenSky doesn't return this data without a separate aircraft DB lookup. Photo is `picsum.photos` seeded by `icao24`. Rarity is random. All flagged with comments in source.

---

## Admin Section

Route: `/admin` — protected by `isAdmin` state in `App.tsx`, toggled by `AdminLogin`. Sub-routes: `dashboard`, `logs`, `diagnostics`, `testing`. See `docs/ADMIN_GUIDE.md` for full details.

---

## Docs

`docs/`: `ARCHITECTURE.md`, `DEPLOYMENT_GUIDE.md`, `TESTING_GUIDE.md`, `ADMIN_GUIDE.md`, `SRS.md`, `GAP_ANALYSIS.md`.

```

### FILE: components/ui/badge.tsx
```typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

```

### FILE: components/ui/button.tsx
```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

### FILE: components/ui/card.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

### FILE: components/ui/dialog.tsx
```typescript
import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

```

### FILE: components/ui/input.tsx
```typescript
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

```

### FILE: components/ui/scroll-area.tsx
```typescript
"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }

```

### FILE: components/ui/skeleton.tsx
```typescript
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

```

### FILE: components/ui/tabs.tsx
```typescript
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }

```

### FILE: components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}

```

### FILE: CREATION.md
```md
# flydee

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || npm install
COPY . .
RUN pnpm run build || npm run build

FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
﻿# Administrator Guide

## Overview
This guide provides instructions for administrators to manage the Flydee application.

## Admin Panel
Access the admin panel via the `/admin` route. You will be prompted for a password.

## Features
- **Dashboard**: System overview and theme management.
- **Audit Logs**: View administrative actions.
- **Diagnostics**: System health checks.
- **Testing Suite**: Run E2E tests.

## React Version
This application requires React 19.2.5.

```

### FILE: docs/ARCHITECTURE.md
```md
﻿# Architecture Overview

## System Architecture
The application follows a client-side SPA architecture using React 19.2.5, Vite, and Tailwind CSS. Firebase is used for authentication and Firestore for data storage.

```mermaid
graph TD
    User[User] -->|Interacts| UI[React UI]
    UI -->|Auth| Auth[Firebase Auth]
    UI -->|Data| DB[Firestore]
    UI -->|Flight Data| API[OpenSky API]
```

## Database Architecture
The database structure is defined in `firebase-blueprint.json` and uses Firestore.

```mermaid
graph TD
    Cards[cards collection] -->|Schema| AircraftCard[AircraftCard Entity]
    Users[users collection] -->|Schema| UserProfile[UserProfile Entity]
```

```

### FILE: docs/DEPLOYMENT_GUIDE.md
```md
﻿# Deployment Guide

## Prerequisites
- Node.js (latest LTS)
- npm

## Deployment Steps
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your preferred hosting provider.

## React Version
This application requires React 19.2.5.

```

### FILE: docs/GAP_ANALYSIS.md
```md
# Gap Analysis Report

## SRS vs Current Implementation

| SRS Feature | Status | Gap/Notes |
| :--- | :--- | :--- |
| 1. Introduction | Implemented | - |
| 2. Overall Description | Implemented | - |
| 3. External Interface Requirements | Implemented | - |
| 4. Core System Features | Implemented | - |
| 5. Gamification and Social Features | Partially Implemented | Rarity system exists, achievements and social sharing pending. |
| 6. Performance Requirements | Implemented | Needs performance testing. |
| 7. Security Requirements | Implemented | OAuth implemented, GDPR compliance needs review. |
| 8. Software Quality Attributes | Implemented | - |
| 9. Database and Storage Requirements | Implemented | Firebase used. |
| 10. Hardware and Device Requirements | Implemented | - |
| 11. APIs and Third-Party Integrations | Implemented | OpenSky used. |
| 12. Monetisation Strategy | Not Implemented | Pending. |
| 13. Assumptions and Dependencies | Implemented | - |
| 16. Testing Framework | Implemented | Playwright suite and admin testing dashboard added. |
| 17. Documentation | Implemented | All guides created in /docs. |

```

### FILE: docs/SRS.md
```md
# Software Requirements Specification (SRS) for Flydee

## 1. Introduction
**1.1 Purpose:** This document outlines the software requirements for Flydee, a mobile application designed to identify overhead aircraft and gamify the plane-spotting experience through digital collectable cards.
**1.2 Scope:** The application will utilise device sensors and external flight data APIs to identify aircraft. It will allow users to capture photos, generate digital cards with flight statistics, and build a virtual collection based on rarity and aircraft type.
**1.3 Intended Audience:** Developers, project managers, UI/UX designers, and potential investors.
## 2. Overall Description
**2.1 Product Perspective:** Flydee is a standalone mobile application for iOS and Android, integrating augmented reality (AR) concepts with real-time aviation data tracking.
**2.2 User Classes:** Casual users seeking entertainment, aviation enthusiasts tracking specific models, and competitive players focused on building rare collections.
**2.3 Operating Environment:** Mobile devices running iOS 15.0+ and Android 10.0+. Active internet connection and location services are mandatory.
## 3. External Interface Requirements
**3.1 User Interfaces:** The primary interface will be a camera-first AR viewfinder. Secondary screens will include a digital binder for the card collection, a global map, and user profile settings.
**3.2 Hardware Interfaces:** The software must interface with the device camera, GPS module, compass, and gyroscope to calculate line-of-sight vectors.
**3.3 Communications Interfaces:** HTTPS RESTful APIs for fetching real-time flight data and connecting to the central backend server for user authentication and database synchronisation.
## 4. Core System Features
**4.1 Capture Mode:** The system shall provide a camera interface that overlays a targeting reticle, allowing users to "lock on" to an aircraft using spatial data.
**4.2 Flight Identification:** Upon capture, the app shall transmit spatial coordinates to the backend to match the vector with live ADS-B flight data, returning the flight number, aircraft type, route, and altitude.
**4.3 Card Generation:** The system shall overlay the retrieved flight statistics onto the user's captured photograph, formatting it as a digital collectable card.
## 5. Gamification and Social Features
**5.1 Rarity System:** Cards shall be assigned rarity tiers (e.g., Common, Uncommon, Rare, Legendary) based on the aircraft model, route frequency, and special liveries.
**5.2 Achievements:** Users shall unlock badges for specific milestones, such as spotting aircraft from ten different airlines or capturing international flights.
**5.3 Social Sharing:** The application shall provide native sharing functionalities to export cards to social media platforms like Instagram, X, and WhatsApp.
## 6. Performance Requirements
**6.1 API Latency:** Flight data retrieval and matching must occur within 2.5 seconds of the user pressing the capture button to maintain an engaging user experience.
**6.2 Battery Consumption:** The app must optimise camera and GPS usage to prevent excessive battery drain during extended plane-spotting sessions.
## 7. Security Requirements
**7.1 Data Privacy:** User location data must only be processed at the moment of capture for identification purposes and must not be stored long-term or sold to third parties, ensuring GDPR compliance.
**7.2 Authentication:** Standard OAuth 2.0 protocols (Google, Apple, email) must be used for secure user account creation and login.
## 8. Software Quality Attributes
**8.1 Usability:** The user interface must be intuitive, requiring zero technical knowledge of aviation or AR mechanics to successfully capture a plane.
**8.2 Reliability:** The application must gracefully handle scenarios where an aircraft cannot be identified, offering a clear error message and prompting the user to try again.
## 9. Database and Storage Requirements
**9.1 Cloud Storage:** User profiles, card inventories, and compressed photo assets must be stored in a scalable cloud database (e.g., Firebase or AWS S3) to allow cross-device syncing.
**9.2 Local Caching:** Recently viewed cards and the user's primary collection must be cached locally on the device to minimise load times and reduce data consumption.
## 10. Hardware and Device Requirements
**10.1 Minimum Specifications:** Devices must feature a functional rear-facing camera, accurate GPS tracking, and a magnetometer (compass) for spatial orientation.
**10.2 Permissions:** The app requires explicit user permission for Location (while using the app), Camera, and Local Storage.
## 11. APIs and Third-Party Integrations
**11.1 Flight Data Provider:** Integration with a robust aviation data provider, such as the FlightAware API or Flightradar24 API, for real-time ADS-B telemetry.
**11.2 Mapping Services:** Integration with Mapbox or Google Maps SDK to display the flight path of the captured aircraft on the back of the digital card.
## 12. Monetisation Strategy
**12.1 Freemium Model:** The core capture and collection loop will remain free.
**12.2 Premium Features:** A subscription or one-time purchase could offer features like detailed historical flight data, exclusive card borders, or an ad-free experience.
## 13. Assumptions and Dependencies
**13.1 Third-Party Uptime:** The app's core functionality is entirely dependent on the uptime and accuracy of the chosen third-party flight data API.
**13.2 Environmental Factors:** The system assumes the user has a clear line of sight to the sky; heavily overcast weather or severe light pollution may hinder the user's ability to spot targets.
## 16. Testing Framework
**16.1 E2E Testing:** Playwright-based end-to-end testing suite for critical user journeys.
**16.2 Admin Testing:** Interactive testing dashboard in the admin panel for running and monitoring test suites.
## 17. Documentation
**17.1 Architecture:** System and database architecture diagrams.
**17.2 Admin Guide:** Instructions for administrative tasks.
**17.3 Deployment Guide:** Steps for building and deploying the application.
**17.4 Testing Guide:** Instructions for running the E2E test suite.

```

### FILE: docs/TESTING_GUIDE.md
```md
﻿# Testing Guide

## Overview
This guide outlines how to run the E2E testing suite.

## Running Tests
1. Install dependencies: `npm install`
2. Run tests: `npx playwright test`

## React Version
This application requires React 19.2.5.

```

### FILE: firebase-applet-config.json
```json
{
  "projectId": "gen-lang-client-0402452400",
  "appId": "1:381783929321:web:adada2cb75c8fe90425b78",
  "apiKey": "AIzaSyCFjLo7AEQbMbz1CmXxk-e4Qf8lCEcQ_fo",
  "authDomain": "gen-lang-client-0402452400.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-d7950cac-468b-40ca-b056-5077be254551",
  "storageBucket": "gen-lang-client-0402452400.firebasestorage.app",
  "messagingSenderId": "381783929321",
  "measurementId": ""
}
```

### FILE: firebase-blueprint.json
```json
{
  "entities": {
    "AircraftCard": {
      "title": "AircraftCard",
      "description": "A digital collectable card representing a spotted aircraft.",
      "type": "object",
      "properties": {
        "icao24": { "type": "string" },
        "callsign": { "type": "string" },
        "aircraftType": { "type": "string" },
        "airline": { "type": "string" },
        "origin": { "type": "string" },
        "destination": { "type": "string" },
        "altitude": { "type": "number" },
        "speed": { "type": "number" },
        "capturedAt": { "type": "number" },
        "photoUrl": { "type": "string" },
        "rarity": { "type": "string", "enum": ["Common", "Uncommon", "Rare", "Legendary"] },
        "location": {
          "type": "object",
          "properties": {
            "lat": { "type": "number" },
            "lng": { "type": "number" }
          }
        },
        "userId": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" }
      },
      "required": ["icao24", "callsign", "userId", "capturedAt"]
    }
  },
  "firestore": {
    "/cards/{cardId}": {
      "schema": "AircraftCard",
      "description": "Collection of all captured aircraft cards."
    }
  }
}

```

### FILE: index.html
```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="FLYDEE — Gamified Plane Spotting" />
    <meta property="og:description" content="The world" />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="FLYDEE — Gamified Plane Spotting" />
    <meta name="twitter:description" content="The world" />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FLYDEE — Gamified Plane Spotting</title>
    <meta name="description" content="The world's first gamified plane-spotting experience." />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: metadata.json
```json
{
  "name": "Flydee",
  "description": "A plane-spotting gamified experience. Identify aircraft in the sky using your camera and sensors, and collect digital cards.",
  "requestFramePermissions": ["camera", "geolocation"],
  "majorCapabilities": ["AR Viewfinder", "Flight Tracking", "Digital Collection"]
}

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@base-ui/react": "^1.4.0",
    "@fontsource-variable/geist": "^5.2.8",
    "@google/genai": "^1.50.0",
    "@tailwindcss/vite": "^4.2.2",
    "@vitejs/plugin-react": "^6.0.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "firebase": "^12.12.0",
    "lucide-react": "^1.8.0",
    "motion": "^12.38.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.14.1",
    "react-use": "^17.6.0",
    "recharts": "^3.8.1",
    "shadcn": "^4.2.0",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "vite": "^8.0.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@types/express": "^5.0.6",
    "@types/node": "^25.6.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "autoprefixer": "^10.5.0",
    "playwright": "^1.59.1",
    "tailwindcss": "^4.2.2",
    "tsx": "^4.21.0",
    "typescript": "~6.0.2",
    "vite": "^6.2.0"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d7950cac-468b-40ca-b056-5077be254551

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/App.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Grid, Map as MapIcon, LogIn, Plane } from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import Viewfinder from './components/Viewfinder';
import { Button } from './components/ui/button';

const Collection = React.lazy(() => import('./components/Collection'));
const Map = React.lazy(() => import('./components/Map'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const AuditLogs = React.lazy(() => import('./components/admin/AuditLogs'));
const Diagnostics = React.lazy(() => import('./components/admin/Diagnostics'));
const TestingDashboard = React.lazy(() => import('./components/admin/TestingDashboard'));
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin'));

function PageLoader() {
  return (
    <div className="flex-1 bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Plane className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppContent user={user} />} />
      <Route
        path="/admin"
        element={
          <React.Suspense fallback={<PageLoader />}>
            {isAdmin ? <AdminLayout /> : <AdminLogin onLogin={() => setIsAdmin(true)} />}
          </React.Suspense>
        }
      >
        <Route path="dashboard" element={<React.Suspense fallback={<PageLoader />}><AdminDashboard /></React.Suspense>} />
        <Route path="logs" element={<React.Suspense fallback={<PageLoader />}><AuditLogs /></React.Suspense>} />
        <Route path="diagnostics" element={<React.Suspense fallback={<PageLoader />}><Diagnostics /></React.Suspense>} />
        <Route path="testing" element={<React.Suspense fallback={<PageLoader />}><TestingDashboard /></React.Suspense>} />
      </Route>
    </Routes>
  );
}

function AppContent({ user }: { user: FirebaseUser | null }) {
  const [activeTab, setActiveTab] = useState<'viewfinder' | 'collection' | 'map'>('viewfinder');

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err?.message ?? 'Login failed');
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-6 text-center font-mono">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="relative inline-block mb-8">
            <Plane className="w-24 h-24 text-white rotate-45" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-white/20 rounded-full blur-3xl"
            />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">FLYDEE</h1>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm uppercase tracking-widest leading-relaxed">
            The world's first gamified plane-spotting experience.
          </p>
        </motion.div>

        <Button
          size="lg"
          onClick={handleLogin}
          className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg font-bold rounded-full flex gap-3"
        >
          <LogIn className="w-5 h-5" />
          INITIALIZE SYSTEM
        </Button>

        {loginError && (
          <p className="mt-4 text-red-400 text-xs uppercase tracking-widest max-w-xs text-center">
            {loginError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-screen bg-black flex flex-col text-white" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <main className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
        {activeTab === 'viewfinder' && <Viewfinder />}
        {activeTab === 'collection' && (
          <React.Suspense fallback={<PageLoader />}>
            <Collection />
          </React.Suspense>
        )}
        {activeTab === 'map' && (
          <React.Suspense fallback={<PageLoader />}>
            <Map />
          </React.Suspense>
        )}
      </main>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-6 z-50 text-white"
        style={{ flexShrink: 0, height: '5rem' }}
      >
        <NavButton active={activeTab === 'collection'} onClick={() => setActiveTab('collection')} icon={<Grid className="w-6 h-6" />} label="Binder" />
        <NavButton active={activeTab === 'viewfinder'} onClick={() => setActiveTab('viewfinder')} icon={<Camera className="w-8 h-8" />} label="Open viewfinder scanner" primary />
        <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon className="w-6 h-6" />} label="Radar" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, primary }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active ? 'true' : 'false'}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${primary ? '-mt-10' : ''} ${active ? 'text-white' : 'text-zinc-400'}`}
    >
      <div className={`p-3 rounded-full transition-all duration-300 ${primary ? 'bg-white text-black shadow-xl shadow-white/10 scale-110' : active ? 'bg-zinc-900' : ''}`}>
        {icon}
      </div>
      {!primary && <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>}
    </button>
  );
}

```

### FILE: src/components/admin/AdminDashboard.tsx
```typescript
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-4">Welcome to the admin dashboard.</p>
      <ThemeSwitcher />
    </div>
  );
}

```

### FILE: src/components/admin/AdminLayout.tsx
```typescript
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <nav className="w-64 border-r border-zinc-800 p-4">
        <h1 className="font-bold mb-8">Admin Panel</h1>
        <ul className="space-y-2">
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/logs">Audit Logs</Link></li>
          <li><Link to="/admin/diagnostics">Diagnostics</Link></li>
          <li><Link to="/admin/testing">Testing Suite</Link></li>
        </ul>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

```

### FILE: src/components/admin/AdminLogin.tsx
```typescript
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="p-8 bg-zinc-900 rounded-lg border border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-4">Admin Access</h2>
        <Input 
          type="password" 
          value={password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={() => password =[REDACTED_CREDENTIAL]
      </div>
    </div>
  );
}

```

### FILE: src/components/admin/AuditLogs.tsx
```typescript
import React from 'react';

export default function AuditLogs() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
      <p>List of admin actions.</p>
    </div>
  );
}

```

### FILE: src/components/admin/Diagnostics.tsx
```typescript
import React from 'react';

export default function Diagnostics() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Diagnostics</h2>
      <p>System health and diagnostics.</p>
    </div>
  );
}

```

### FILE: src/components/admin/TestingDashboard.tsx
```typescript
import React from 'react';
import { Button } from '../ui/button';

export default function TestingDashboard() {
  const runTests = () => {
    console.log('Running Playwright tests...');
    // In a real app, this would trigger the test runner
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Testing Suite</h2>
      <Button onClick={runTests}>Run E2E Tests</Button>
    </div>
  );
}

```

### FILE: src/components/admin/ThemeSwitcher.tsx
```typescript
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Sun, Moon, Contrast } from 'lucide-react';

const THEMES = ['dark', 'light', 'high-contrast'] as const;
type Theme = typeof THEMES[number];

export default function ThemeSwitcher() {
  const applyTheme = (theme: Theme) => {
    document.documentElement.classList.remove(...THEMES);
    document.documentElement.classList.add(theme);
    localStorage.setItem('flydee_theme', theme);
  };

  useEffect(() => {
    const saved = localStorage.getItem('flydee_theme') as Theme | null;
    applyTheme(saved ?? 'dark');
  }, []);

  return (
    <div className="flex gap-2">
      {THEMES.map((theme) => (
        <Button
          key={theme}
          variant="outline"
          size="icon"
          onClick={() => applyTheme(theme)}
          className="capitalize"
        >
          {theme === 'dark' && <Moon className="w-4 h-4" />}
          {theme === 'light' && <Sun className="w-4 h-4" />}
          {theme === 'high-contrast' && <Contrast className="w-4 h-4" />}
        </Button>
      ))}
    </div>
  );
}

```

### FILE: src/components/Collection.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { Tooltip } from './ui/tooltip';
import { motion } from 'motion/react';
import { Search, Plane } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AircraftCard } from '../types';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

// Planespotters thumbnail API — real aircraft photos by ICAO24 hex
// v3 — bust any stale Wikimedia entries from previous sessions
const photoCache = new Map<string, string>();
const CACHE_VERSION = 'v3';

// Aviation-themed fallbacks from Unsplash (CORS-safe, reliable)
// Base path for public assets — works in both dev (/) and prod (/flydee/)
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// Callsign-prefix → specific aircraft photo (local public assets)
const CALLSIGN_PHOTOS: Record<string, string> = {
  BAW: `${BASE}/images/aircraft-777-front.png`,
  DAL: `${BASE}/images/aircraft-767-delta.png`,
  EZY: `${BASE}/images/aircraft-a320-easyjet.png`,
};

// General fallback pool — all local assets, no external CORS dependency
const AVIATION_FALLBACKS = [
  `${BASE}/images/aircraft-777-front.png`,
  `${BASE}/images/aircraft-777-front2.png`,
  `${BASE}/images/aircraft-767-delta.png`,
  `${BASE}/images/aircraft-a320-easyjet.png`,
  `${BASE}/images/aircraft-a320-approach.png`,
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function fallbackForCard(callsign: string, cardId: string) {
  // First try callsign prefix match
  const prefix = callsign.slice(0, 3).toUpperCase();
  if (CALLSIGN_PHOTOS[prefix]) return CALLSIGN_PHOTOS[prefix];
  // Otherwise spread across pool by cardId hash
  return AVIATION_FALLBACKS[hashStr(cardId) % AVIATION_FALLBACKS.length];
}

async function fetchAircraftPhoto(icao24: string, callsign: string, cardId: string): Promise<string> {
  const key = `${CACHE_VERSION}:${cardId}`;
  if (photoCache.has(key)) return photoCache.get(key)!;
  const fallback = fallbackForCard(callsign, cardId);
  try {
    const res = await fetch(`https://api.planespotters.net/pub/photos/hex/${icao24}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('not ok');
    const data = await res.json();
    const url =
      data?.photos?.[0]?.thumbnail_large?.src ||
      data?.photos?.[0]?.thumbnail?.src ||
      '';
    const result = url || fallback;
    photoCache.set(key, result);
    return result;
  } catch {
    photoCache.set(key, fallback);
    return fallback;
  }
}

const BAD_URL = (u: string) =>
  !u || u.includes('picsum') || u.includes('PNG_transparency') || u.includes('placeholder');

function useAircraftPhoto(card: AircraftCard) {
  const [src, setSrc] = useState<string>(BAD_URL(card.photoUrl) ? '' : card.photoUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!BAD_URL(card.photoUrl) && !failed) return;
    fetchAircraftPhoto(card.icao24, card.callsign, card.id).then(setSrc);
  }, [card.id, card.icao24, card.callsign, card.photoUrl, failed]);

  const handleError = () => {
    setFailed(true);
    setSrc(fallbackForCard(card.callsign, card.id));
  };

  return { src, handleError };
}

const rarityColor = (r: AircraftCard['rarity']) =>
  r === 'Legendary' ? '#f59e0b' :
  r === 'Rare'      ? '#a78bfa' :
  r === 'Uncommon'  ? '#38bdf8' : '#71717a';

function AircraftCardTile({ card, onClick }: { card: AircraftCard; onClick: () => void }) {
  const { src: photo, handleError } = useAircraftPhoto(card);
  const color = rarityColor(card.rarity);

  return (
    <Tooltip
      text={`${card.callsign} · ${card.rarity} · ${Math.round(card.altitude).toLocaleString()}m`}
      position="top"
      block
    >
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClick}
        className="group relative rounded-xl overflow-hidden cursor-pointer w-full"
        style={{ height: 160, border: `1.5px solid ${color}55` }}
      >
        {/* Photo or skeleton */}
        {photo ? (
          <img
            src={photo}
            alt={card.callsign}
            onError={handleError}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: 'center 65%', fontSize: 0 }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${color}0a` }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <Plane className="w-8 h-8" style={{ color: `${color}60` }} />
              <span className="text-[9px] tracking-widest uppercase" style={{ color: `${color}60` }}>Loading…</span>
            </div>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Top-right rarity badge */}
        <div
          className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
          style={{ background: `${color}33`, border: `1px solid ${color}cc`, color }}
        >
          {card.rarity}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3 pt-6">
          <div className="text-base font-black leading-none tracking-tight text-white drop-shadow-lg">{card.callsign}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] uppercase tracking-wider truncate" style={{ color }}>{card.aircraftType}</span>
            <span className="text-zinc-500 text-[9px]">·</span>
            <span className="text-[9px] text-zinc-400">{card.altitude ? `${Math.round(card.altitude / 100) * 100}m` : ''}</span>
          </div>
        </div>
      </motion.div>
    </Tooltip>
  );
}

function DialogPhoto({ card }: { card: AircraftCard }) {
  const { src: photo, handleError } = useAircraftPhoto(card);
  if (!photo) return (
    <div className="w-full h-56 rounded-xl animate-pulse flex items-center justify-center" style={{ background: `${rarityColor(card.rarity)}0a`, border: `1px solid ${rarityColor(card.rarity)}33` }}>
      <Plane className="w-10 h-10 text-zinc-700" />
    </div>
  );
  return (
    <img
      src={photo}
      alt={card.callsign}
      onError={handleError}
      className="w-full h-56 object-cover rounded-xl"
      referrerPolicy="no-referrer"
    />
  );
}

export default function Collection() {
  const [cards, setCards] = useState<AircraftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('All');
  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary'];
  const [selectedCard, setSelectedCard] = useState<AircraftCard | null>(null);

  useEffect(() => {
    // Wait for auth to resolve before querying — avoids race on cold load
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { setLoading(false); return; }

      const q = query(
        collection(db, 'cards'),
        where('userId', '==', user.uid),
        orderBy('capturedAt', 'desc')
      );

      const unsubSnap = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AircraftCard));
        setCards(docs);
        setLoading(false);
      });

      return unsubSnap;
    });

    return () => unsubAuth();
  }, []);

  const filteredCards = cards.filter(c => {
    const matchesSearch =
      c.callsign.toLowerCase().includes(search.toLowerCase()) ||
      c.aircraftType.toLowerCase().includes(search.toLowerCase());
    const matchesRarity =
      rarityFilter === 'All' || c.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-950 text-white px-6 pt-6 font-mono overflow-x-hidden">
      <header className="mb-4">
        <h1 className="text-4xl font-black tracking-tighter mb-2">FLIGHT BINDER</h1>
        <div className="flex items-center gap-4 text-zinc-500 text-xs uppercase tracking-widest">
          <span>Total: {cards.length}</span>
          <span>•</span>
          <span>Unique: {new Set(cards.map(c => c.icao24)).size}</span>
        </div>
      </header>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input 
          placeholder="SEARCH COLLECTION..." 
          className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-zinc-700"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar px-1 -mx-1">
        {rarities.map(r => (
          <Tooltip
            key={r}
            position="top"
            text={
              r === 'All' ? 'Show all aircraft' :
              r === 'Common' ? 'Frequently spotted aircraft' :
              r === 'Uncommon' ? 'Less frequently spotted' :
              r === 'Rare' ? 'Hard to find aircraft' :
              'Extremely rare catches'
            }
          >
            <button
              onClick={() => setRarityFilter(r)}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-all flex-shrink-0"
              style={rarityFilter === r
                ? { background: '#ffffff', color: '#000000', borderColor: '#ffffff' }
                : { background: '#3f3f46', color: '#f4f4f5', borderColor: '#71717a' }
              }
            >
              {r}
            </button>
          </Tooltip>
        ))}
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-zinc-900 animate-pulse" style={{ height: 160 }} />
            ))
          ) : filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <AircraftCardTile key={card.id} card={card} onClick={() => setSelectedCard(card)} />
            ))
          ) : (
            <div className="col-span-2 py-20 text-center">
              <Plane className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <div className="text-zinc-600 uppercase text-sm tracking-widest">No aircraft found</div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="font-mono text-white p-0 overflow-hidden max-w-sm"
          style={{ background: '#0a0a0a', border: `1.5px solid ${rarityColor(selectedCard?.rarity ?? 'Common')}55` }}>
          {/* Hero photo */}
          {selectedCard && <DialogPhoto card={selectedCard} />}

          <div className="px-5 pb-5 pt-3">
            {/* Callsign + rarity */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-white leading-none">
                  {selectedCard?.callsign}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                  {selectedCard?.aircraftType}
                </DialogDescription>
              </div>
              <span
                className="shrink-0 mt-0.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                style={{
                  background: `${rarityColor(selectedCard?.rarity ?? 'Common')}22`,
                  border: `1px solid ${rarityColor(selectedCard?.rarity ?? 'Common')}88`,
                  color: rarityColor(selectedCard?.rarity ?? 'Common'),
                }}
              >
                {selectedCard?.rarity}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800 mb-3" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: 'Origin',      value: selectedCard?.origin || '—' },
                { label: 'Destination', value: selectedCard?.destination || '—' },
                { label: 'Altitude',    value: selectedCard?.altitude ? `${Math.round(selectedCard.altitude).toLocaleString()} m` : '—' },
                { label: 'Speed',       value: selectedCard?.speed ? `${Math.round(selectedCard.speed)} kts` : '—' },
                { label: 'Captured',    value: new Date(selectedCard?.capturedAt || 0).toLocaleDateString() },
                { label: 'ICAO24',      value: selectedCard?.icao24?.toUpperCase() || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm font-bold text-zinc-200">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

### FILE: src/components/Map.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Plane, MapPin, Navigation } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AircraftCard } from '../types';

function projectToScreen(
  cardLat: number,
  cardLng: number,
  centerLat: number,
  centerLng: number,
  rangeKm: number = 100,
  seed: number = 0
): { left: string; top: string; outOfRange: boolean } {
  const latRange = rangeKm / 111;
  const lngRange = rangeKm / (111 * Math.cos(centerLat * Math.PI / 180));
  const x = 50 + ((cardLng - centerLng) / lngRange) * 50;
  const y = 50 - ((cardLat - centerLat) / latRange) * 50;
  const outOfRange = x < 5 || x > 95 || y < 5 || y > 95;
  if (outOfRange) {
    // Place out-of-range dots in a ring around center so they're always visible
    const angle = (seed * 137.5) % 360;
    const r = 25 + (seed % 5) * 3;
    return {
      left: `${50 + r * Math.cos(angle * Math.PI / 180)}%`,
      top: `${50 + r * Math.sin(angle * Math.PI / 180)}%`,
      outOfRange: true,
    };
  }
  return { left: `${x}%`, top: `${y}%`, outOfRange: false };
}

export default function Map() {
  const [cards, setCards] = useState<AircraftCard[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'cards'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AircraftCard));
      setCards(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-950 text-white p-6 font-mono relative overflow-hidden">
      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">GLOBAL RADAR</h1>
        <div className="text-zinc-500 text-xs uppercase tracking-widest">
          SIGHTINGS LOGGED GLOBALLY
        </div>
      </header>

      {/* Map Background — dot grid + cross-hatch */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [background-size:100px_100px]" />
      </div>

      <div className="flex-1 relative border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        {/* Concentric range rings */}
        {[25, 50, 75].map(r => (
          <div
            key={r}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${r}%`,
              height: `${r}%`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid rgba(74,222,128,0.12)',
            }}
          />
        ))}
        {/* Cross-hair lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(74,222,128,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.07) 1px, transparent 1px)',
          backgroundSize: '50% 50%',
          backgroundPosition: '50% 50%',
        }} />

        {/* Radar Sweeper */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square origin-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(74,222,128,0.28) 0deg, rgba(74,222,128,0.08) 40deg, transparent 80deg)',
          }}
        />

        {/* User Location */}
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative flex items-center justify-center">
              {/* Outer pulse ring */}
              <div className="absolute w-10 h-10 rounded-full border border-blue-400/40 animate-ping" />
              {/* Mid ring */}
              <div className="absolute w-7 h-7 rounded-full border border-blue-400/30" />
              {/* Core dot */}
              <div className="w-4 h-4 bg-blue-400 rounded-full" style={{ boxShadow: '0 0 12px 4px rgba(96,165,250,0.7)' }} />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-blue-300 font-black tracking-widest whitespace-nowrap">YOU</div>
            </div>
          </div>
        )}

        {/* Spotted Planes */}
        {cards.map((card, i) => {
          const pos = userLocation
            ? projectToScreen(
                card.location.lat,
                card.location.lng,
                userLocation.lat,
                userLocation.lng,
                100,
                i
              )
            : { left: `${45 + (i % 3) * 5}%`, top: `${45 + Math.floor(i / 3) * 5}%`, outOfRange: false };

          // Always use rarity colour — distant cards are dimmed but still coloured
          const rarityColor =
            card.rarity === 'Legendary' ? '#f59e0b' :
            card.rarity === 'Rare'      ? '#a78bfa' :
            card.rarity === 'Uncommon'  ? '#38bdf8' :
                                          '#4ade80';

          const alpha = pos.outOfRange ? '99' : 'ff';  // dim distant, full for in-range
          const glowStrength = pos.outOfRange ? '0 0 10px 3px' : '0 0 16px 5px';
          const glowAlpha = pos.outOfRange ? 0.35 : 0.65;

          const rarityGlow =
            card.rarity === 'Legendary' ? `${glowStrength} rgba(245,158,11,${glowAlpha})` :
            card.rarity === 'Rare'      ? `${glowStrength} rgba(167,139,250,${glowAlpha})` :
            card.rarity === 'Uncommon'  ? `${glowStrength} rgba(56,189,248,${glowAlpha})` :
                                          `${glowStrength} rgba(74,222,128,${glowAlpha})`;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ position: 'absolute', left: pos.left, top: pos.top }}
              className="group cursor-pointer -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="relative flex flex-col items-center gap-1">
                {/* Plane icon with glow ring */}
                <div
                  className="relative flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-125"
                  style={{
                    width: 40,
                    height: 40,
                    background: `${rarityColor}22`,
                    border: `2px solid ${rarityColor}${alpha}`,
                    boxShadow: rarityGlow,
                  }}
                >
                  <Plane
                    style={{ color: `${rarityColor}${alpha}` }}
                    className="w-5 h-5 rotate-45"
                  />
                </div>

                {/* Always-visible callsign label */}
                <div
                  className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider whitespace-nowrap leading-none"
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    border: `1px solid ${rarityColor}${pos.outOfRange ? '55' : '99'}`,
                    color: `${rarityColor}${alpha}`,
                  }}
                >
                  {card.callsign}{pos.outOfRange ? ' ↗' : ''}
                </div>

                {/* Hover tooltip — rich detail card */}
                <div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 scale-95 group-hover:scale-100 z-30"
                  style={{ minWidth: 160 }}
                >
                  <div
                    className="rounded-lg p-3 font-mono"
                    style={{
                      background: 'rgba(0,0,0,0.92)',
                      border: `1px solid ${rarityColor}88`,
                      boxShadow: `0 4px 24px rgba(0,0,0,0.8), 0 0 0 1px ${rarityColor}22`,
                    }}
                  >
                    {/* Callsign + rarity */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-white font-black text-sm tracking-tight">{card.callsign}</span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: `${rarityColor}22`, color: rarityColor }}
                      >
                        {card.rarity}
                      </span>
                    </div>
                    {/* Divider */}
                    <div style={{ height: 1, background: `${rarityColor}33`, marginBottom: 8 }} />
                    {/* Stats */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Aircraft</span>
                        <span className="text-zinc-200 font-semibold">{card.aircraftType || '—'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Altitude</span>
                        <span className="text-zinc-200 font-semibold">{card.altitude ? `${Math.round(card.altitude).toLocaleString()} m` : '—'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Speed</span>
                        <span className="text-zinc-200 font-semibold">{card.speed ? `${Math.round(card.speed)} kts` : '—'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Captured</span>
                        <span className="text-zinc-200 font-semibold">{new Date(card.capturedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {pos.outOfRange && (
                      <div className="mt-2 text-[9px] text-zinc-600 uppercase tracking-wider">Outside radar range</div>
                    )}
                  </div>
                  {/* Arrow */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full"
                    style={{
                      width: 0, height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${rarityColor}88`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Map Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <Navigation className="w-3 h-3" />
              <span>ACTIVE SCANNING...</span>
            </div>
            <div className="text-xs font-bold text-zinc-400">
              {cards.length} SIGHTINGS RECORDED
            </div>
          </div>
          <div className="w-24 h-24 border border-zinc-800 rounded bg-black/40 p-2">
            <div className="text-[8px] text-zinc-600 mb-1">SIGNAL STRENGTH</div>
            <div className="flex items-end gap-0.5 h-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-green-500/40" 
                  style={{ height: `${Math.random() * 100}%` }} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

### FILE: src/components/ui/badge.tsx
```typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

```

### FILE: src/components/ui/button.tsx
```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

### FILE: src/components/ui/card.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

### FILE: src/components/ui/dialog.tsx
```typescript
import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

```

### FILE: src/components/ui/input.tsx
```typescript
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

```

### FILE: src/components/ui/scroll-area.tsx
```typescript
"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }

```

### FILE: src/components/ui/skeleton.tsx
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

```

### FILE: src/components/ui/tabs.tsx
```typescript
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }

```

### FILE: src/components/ui/tooltip.tsx
```typescript
import React, { useState, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  block?: boolean;
}

export function Tooltip({ text, children, position = 'top', block = false }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setCoords({
        top: position === 'top' ? rect.top : rect.bottom,
        left: rect.left + rect.width / 2,
      });
    }
    setVisible(true);
  };

  return (
    <div
      ref={ref}
      className={block ? 'flex flex-col' : 'inline-flex'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'fixed',
            top: position === 'top' ? coords.top - 8 : coords.top + 8,
            left: coords.left,
            transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0%)',
            zIndex: 9999,
          }}
          className="pointer-events-none relative whitespace-nowrap bg-zinc-800 border border-zinc-700 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded font-mono shadow-xl z-[9999]"
        >
          {text}
          <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${
            position === 'top'
              ? 'bottom-[-4px] border-t-4 border-t-zinc-700'
              : 'top-[-4px] border-b-4 border-b-zinc-700'
          }`} />
        </div>
      )}
    </div>
  );
}

```

### FILE: src/components/Viewfinder.tsx
```typescript
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Target, Loader2, Info, Share2, Trophy } from 'lucide-react';
import { useSensors } from '../lib/sensors';
import { fetchNearbyFlights, findTargetAircraft } from '../lib/flightApi';
import { Flight, AircraftCard } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { db, auth } from '../firebase';
import { Tooltip } from './ui/tooltip';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Viewfinder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { heading, pitch, location, error: sensorError, orientationReady, startOrientation } = useSensors();
  const [isCapturing, setIsCapturing] = useState(false);
  const [target, setTarget] = useState<Flight | null>(null);
  const [lastCaptured, setLastCaptured] = useState<AircraftCard | null>(null);
  const [scanning, setScanning] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Real ICAO24 hex codes for Boeing 737s with known Planespotters photos
  const MOCK_FLIGHTS: Flight[] = [
    { icao24: '400f6d', callsign: 'BAW292', origin_country: 'United Kingdom', time_position: Date.now(), last_contact: Date.now(), longitude: -0.1278, latitude: 51.5074, baro_altitude: 10500, on_ground: false, velocity: 245, true_track: 135, vertical_rate: 0, sensors: null, geo_altitude: 10500, squawk: '1234', spi: false, position_source: 0 },
    { icao24: 'a4d449', callsign: 'DAL401', origin_country: 'United States', time_position: Date.now(), last_contact: Date.now(), longitude: -0.4543, latitude: 51.4775, baro_altitude: 8200, on_ground: false, velocity: 220, true_track: 270, vertical_rate: -5, sensors: null, geo_altitude: 8200, squawk: '5678', spi: false, position_source: 0 },
    { icao24: '738067', callsign: 'EZY1234', origin_country: 'United Kingdom', time_position: Date.now(), last_contact: Date.now(), longitude: -0.2411, latitude: 51.6523, baro_altitude: 3500, on_ground: false, velocity: 180, true_track: 45, vertical_rate: 10, sensors: null, geo_altitude: 3500, squawk: '9012', spi: false, position_source: 0 },
  ];

  const fetchAircraftPhoto = async (icao24: string): Promise<string> => {
    const FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png';
    try {
      const res = await fetch(`https://api.planespotters.net/pub/photos/hex/${icao24}`);
      if (!res.ok) return FALLBACK;
      const data = await res.json();
      return data?.photos?.[0]?.thumbnail_large?.src || data?.photos?.[0]?.thumbnail?.src || FALLBACK;
    } catch {
      return FALLBACK;
    }
  };

  const handleSimulateCapture = async () => {
    if (!auth.currentUser) return;
    setIsCapturing(true);
    const flight = MOCK_FLIGHTS[Math.floor(Math.random() * MOCK_FLIGHTS.length)];
    const rarities: AircraftCard['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Legendary'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    // Use user's actual location if available, otherwise default to Accra
    const userPos = location || { lat: 5.6037, lng: -0.1870 };
    const mockLocation = {
      lat: userPos.lat + (Math.random() - 0.5) * 0.2,
      lng: userPos.lng + (Math.random() - 0.5) * 0.2,
    };
    const photoUrl = await fetchAircraftPhoto(flight.icao24);
    const newCard: Omit<AircraftCard, 'id'> = {
      icao24: flight.icao24,
      callsign: flight.callsign,
      aircraftType: 'Boeing 737-800',
      airline: flight.callsign.substring(0, 3),
      origin: 'LHR',
      destination: 'JFK',
      altitude: flight.geo_altitude || 0,
      speed: flight.velocity ? Math.round(flight.velocity * 3.6) : 0,
      capturedAt: Date.now(),
      photoUrl,
      rarity,
      location: mockLocation,
    };
    try {
      const docRef = await addDoc(collection(db, 'cards'), {
        ...newCard,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setLastCaptured({ ...newCard, id: docRef.id });
    } catch (err) {
      console.error('Simulate capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async (card: AircraftCard) => {
    const shareText = `✈️ Just spotted ${card.callsign} at ${card.altitude}m altitude — ${card.rarity} catch! #Flydee #PlaneSpotting`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FLYDEE — Aircraft Spotted!',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled — silent
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  useEffect(() => {
    if (!orientationReady) {
      // Maybe show a button to start orientation?
    }
  }, [orientationReady]);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    }
    setupCamera();
  }, []);

  // Periodic scanning for planes in view
  useEffect(() => {
    if (!location || heading === null || pitch === null || isCapturing) return;

    const interval = setInterval(async () => {
      setScanning(true);
      const flights = await fetchNearbyFlights(location.lat, location.lng);
      const found = findTargetAircraft(flights, location.lat, location.lng, heading, pitch);
      setTarget(found);
      setScanning(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [location, heading, pitch, isCapturing]);

  const handleCapture = async () => {
    if (!target || !location || !auth.currentUser) return;

    setIsCapturing(true);

    // Simulate photo capture (in real app, we'd grab a frame from the video)
    const photoUrl = `https://picsum.photos/seed/${target.icao24}/800/1200`;

    const rarities: AircraftCard['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Legendary'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];

    const newCard: Omit<AircraftCard, 'id'> = {
      icao24: target.icao24,
      callsign: target.callsign,
      aircraftType: 'Boeing 737-800', // Mocked, OpenSky doesn't give type easily without another DB
      airline: target.callsign.substring(0, 3), // Mocked
      origin: 'LHR',
      destination: 'JFK',
      altitude: target.geo_altitude || 0,
      speed: target.velocity ? Math.round(target.velocity * 3.6) : 0,
      capturedAt: Date.now(),
      photoUrl,
      rarity,
      location: { ...location }
    };

    try {
      const docRef = await addDoc(collection(db, 'cards'), {
        ...newCard,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setLastCaptured({ ...newCard, id: docRef.id });
    } catch (err) {
      console.error('Error saving card:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-mono">
      {/* Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-lg">
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Position</div>
            <div className="text-xs text-white">
              {location 
                ? `${Math.abs(location.lat).toFixed(4)}°${location.lat >= 0 ? 'N' : 'S'} ${Math.abs(location.lng).toFixed(4)}°${location.lng >= 0 ? 'E' : 'W'}`
                : 'LOCATING...'
              }
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-lg text-right">
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Orientation</div>
            <div className="text-xs text-white">
              HDG: {heading?.toFixed(0)}° | TILT: {pitch?.toFixed(0)}°
            </div>
          </div>
        </div>

        {/* Reticle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/40" />
            
            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-1 h-1 rounded-full ${target ? 'bg-red-500 animate-ping' : 'bg-white/20'}`} />
            </div>

            {/* Target Info */}
            <AnimatePresence>
              {target && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 bg-red-500/90 text-white p-2 text-center rounded border border-red-400 shadow-lg shadow-red-500/20"
                >
                  <div className="text-[10px] uppercase font-bold tracking-tighter">Target Locked</div>
                  <div className="text-lg font-black leading-none">{target.callsign}</div>
                  <div className="text-[10px] opacity-80">ALT: {target.geo_altitude?.toFixed(0)}m</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-center items-end pointer-events-auto pb-12">
          <Button 
            size="lg"
            disabled={!target || isCapturing}
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full border-4 transition-all duration-300 ${
              target 
                ? 'bg-red-600 border-red-400 hover:bg-red-700 scale-110 shadow-2xl shadow-red-500/50' 
                : 'bg-white/10 border-white/20'
            }`}
          >
            {isCapturing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Target className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>

      {/* Simulate Capture */}
      {auth.currentUser && (
        <div className="absolute bottom-36 right-6 z-30 pointer-events-auto">
          <Tooltip text="Simulate a random aircraft capture" position="top">
            <button
              onClick={handleSimulateCapture}
              disabled={isCapturing}
              className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] uppercase tracking-widest px-3 py-2 rounded-full hover:bg-yellow-500/30 disabled:opacity-50"
            >
              {isCapturing ? '...' : '✦ Simulate'}
            </button>
          </Tooltip>
        </div>
      )}

      {/* Scanning Indicator */}
      {scanning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          <Loader2 className="w-3 h-3 animate-spin text-white/50" />
          <span className="text-[10px] text-white/50 uppercase tracking-widest">Scanning Airspace</span>
        </div>
      )}

      {/* Sensor Error Banner */}
      {sensorError && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-72 
          bg-red-900/80 border border-red-500/40 backdrop-blur-sm 
          px-4 py-2 rounded-lg text-center z-30">
          <div className="text-[10px] text-red-300 uppercase tracking-widest mb-1">
            Sensor Warning
          </div>
          <div className="text-xs text-red-200">{sensorError}</div>
        </div>
      )}

      {/* Compass Enable Button */}
      {heading === null && !sensorError && (
        <button
          onClick={startOrientation}
          className="absolute bottom-40 left-1/2 -translate-x-1/2 
            bg-white/10 border border-white/20 backdrop-blur-sm 
            px-6 py-3 rounded-full text-white text-xs uppercase 
            tracking-widest pointer-events-auto z-30"
        >
          ✦ TAP TO ENABLE COMPASS
        </button>
      )}

      {/* Capture Success Modal */}
      <AnimatePresence>
        {lastCaptured && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl"
          >
            <div className="max-w-sm w-full">
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl">
                <div className="relative aspect-[3/4]">
                  <img 
                    src={lastCaptured.photoUrl} 
                    alt="Captured Aircraft" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className={`
                      ${lastCaptured.rarity === 'Legendary' ? 'bg-yellow-500 text-black border-yellow-400' : ''}
                      ${lastCaptured.rarity === 'Rare' ? 'bg-purple-500 text-white border-purple-400' : ''}
                      ${lastCaptured.rarity === 'Uncommon' ? 'bg-blue-500 text-white border-blue-400' : ''}
                      ${lastCaptured.rarity === 'Common' ? 'bg-zinc-500 text-white border-zinc-400' : ''}
                    `}>
                      {lastCaptured.rarity}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-4xl font-black text-white tracking-tighter leading-none mb-1">
                      {lastCaptured.callsign}
                    </div>
                    <div className="text-sm text-white/60 uppercase tracking-widest">
                      {lastCaptured.aircraftType}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Altitude</div>
                    <div className="text-xl font-bold text-white">{lastCaptured.altitude.toFixed(0)}m</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Speed</div>
                    <div className="text-xl font-bold text-white">{lastCaptured.speed.toFixed(0)}km/h</div>
                  </div>
                  <div className="col-span-2 pt-4 flex gap-2">
                    <Button className="flex-1 bg-white text-black hover:bg-zinc-200" onClick={() => setLastCaptured(null)}>
                      COLLECT
                    </Button>
                    <Button variant="outline" className="border-zinc-700 text-white" onClick={() => lastCaptured && handleShare(lastCaptured)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {shareToast && (
                <div className="mt-4 text-center text-xs text-zinc-400 
                  uppercase tracking-widest animate-pulse">
                  ✓ Copied to clipboard
                </div>
              )}

              <div className="mt-8 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/30"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">New Collection Entry!</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

### FILE: src/firebase.ts
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_FIRESTORE_ID);
export const auth = getAuth(app);

```

### FILE: src/index.css
```css
@import "tailwindcss";

html, body, #root {
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* BrowserRouter renders a div — make it fill too */
#root > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Geist Variable', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar: var(--sidebar);
    --color-chart-5: var(--chart-5);
    --color-chart-4: var(--chart-4);
    --color-chart-3: var(--chart-3);
    --color-chart-2: var(--chart-2);
    --color-chart-1: var(--chart-1);
    --color-ring: var(--ring);
    --color-input: var(--input);
    --color-border: var(--border);
    --color-destructive: var(--destructive);
    --color-accent-foreground: var(--accent-foreground);
    --color-accent: var(--accent);
    --color-muted-foreground: var(--muted-foreground);
    --color-muted: var(--muted);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-secondary: var(--secondary);
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --radius: 0.625rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}

.light {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --radius: 0.625rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}
.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
}
.high-contrast {
    --background: #000000;
    --foreground: #FFFFFF;
    --primary: #FFFF00;
    --border: #FFFFFF;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
    }
  body {
    @apply bg-background text-foreground;
    }
  html {
    @apply font-sans;
    }
}
```

### FILE: src/lib/flightApi.ts
```typescript
import { Flight } from '../types';

// OpenSky Network API
const OPENSKY_URL = 'https://opensky-network.org/api/states/all';

const getAuthHeader = (): HeadersInit => {
  const user = import.meta.env.VITE_OPENSKY_USERNAME;
  const pass = import.meta.env.VITE_OPENSKY_PASSWORD;
  if (user && pass) {
    return {
      'Authorization': 'Basic ' + btoa(`${user}:${pass}`)
    };
  }
  return {};
};

let lastFetchTime = 0;
const MIN_FETCH_INTERVAL_MS = 10000; // 10 seconds minimum between calls

export async function fetchNearbyFlights(lat: number, lng: number, radiusKm: number = 50): Promise<Flight[]> {
  const now = Date.now();
  if (now - lastFetchTime < MIN_FETCH_INTERVAL_MS) {
    return []; // Return empty — too soon to fetch again
  }
  lastFetchTime = now;

  // Rough approximation for bounding box
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

  const lamin = lat - latDelta;
  const lomin = lng - lngDelta;
  const lamax = lat + latDelta;
  const lomax = lng + lngDelta;

  try {
    const response = await fetch(`${OPENSKY_URL}?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    
    if (!data.states) return [];

    return data.states.map((s: any[]) => ({
      icao24: s[0],
      callsign: s[1]?.trim() || 'N/A',
      origin_country: s[2],
      time_position: s[3],
      last_contact: s[4],
      longitude: s[5],
      latitude: s[6],
      baro_altitude: s[7],
      on_ground: s[8],
      velocity: s[9],
      true_track: s[10],
      vertical_rate: s[11],
      sensors: s[12],
      geo_altitude: s[13],
      squawk: s[14],
      spi: s[15],
      position_source: s[16],
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}

export function findTargetAircraft(
  flights: Flight[],
  userLat: number,
  userLng: number,
  heading: number,
  pitch: number
): Flight | null {
  if (flights.length === 0) return null;

  // This is a simplified matching algorithm.
  // In a real app, we'd use more complex spherical trigonometry.
  
  let bestMatch: Flight | null = null;
  let minDiff = Infinity;

  flights.forEach(flight => {
    // Calculate azimuth and elevation to the plane
    const dLat = (flight.latitude - userLat) * (Math.PI / 180);
    const dLon = (flight.longitude - userLng) * (Math.PI / 180);
    
    const y = Math.sin(dLon) * Math.cos(flight.latitude * (Math.PI / 180));
    const x = Math.cos(userLat * (Math.PI / 180)) * Math.sin(flight.latitude * (Math.PI / 180)) -
              Math.sin(userLat * (Math.PI / 180)) * Math.cos(flight.latitude * (Math.PI / 180)) * Math.cos(dLon);
    
    let azimuth = Math.atan2(y, x) * (180 / Math.PI);
    azimuth = (azimuth + 360) % 360;

    // Distance in meters (rough)
    const R = 6371e3;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI/180) * Math.cos(flight.latitude * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Elevation angle
    const altitude = flight.geo_altitude || flight.baro_altitude || 0;
    const elevation = Math.atan2(altitude, distance) * (180 / Math.PI);

    // Compare with user's heading and pitch
    const headingDiff = Math.abs((azimuth - heading + 540) % 360 - 180);
    const pitchDiff = Math.abs(elevation - pitch);

    const totalDiff = headingDiff + pitchDiff;

    if (totalDiff < minDiff && totalDiff < 20) { // 20 degree tolerance
      minDiff = totalDiff;
      bestMatch = flight;
    }
  });

  return bestMatch;
}

```

### FILE: src/lib/sensors.ts
```typescript
import { useState, useEffect } from 'react';

export async function requestOrientationPermission(): Promise<boolean> {
  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
  // Non-iOS — permission not required
  return true;
}

export function useSensors() {
  const [heading, setHeading] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orientationReady, setOrientationReady] = useState(false);

  useEffect(() => {
    // Geolocation
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => setError(`Geolocation error: ${err.message}`),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  const startOrientation = async () => {
    const granted = await requestOrientationPermission();
    if (granted) {
      setOrientationReady(true);
      const handleOrientation = (event: DeviceOrientationEvent) => {
        let h = (event as any).webkitCompassHeading || event.alpha;
        if (h !== null) setHeading(h);
        if (event.beta !== null) setPitch(event.beta);
      };
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setError('Orientation permission denied');
    }
  };

  return { heading, pitch, location, error, orientationReady, startOrientation };
}

```

### FILE: src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

### FILE: src/main.tsx
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/flydee'}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

```

### FILE: src/types.ts
```typescript
export interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
}

export interface AircraftCard {
  id: string;
  icao24: string;
  callsign: string;
  aircraftType: string;
  airline: string;
  origin: string;
  destination: string;
  altitude: number;
  speed: number;
  capturedAt: number;
  photoUrl: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  location: {
    lat: number;
    lng: number;
  };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  stats: {
    totalSpotted: number;
    uniqueModels: number;
    rareSpotted: number;
  };
  achievements: string[];
}

```

### FILE: src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_FIRESTORE_ID: string
  readonly VITE_OPENSKY_USERNAME: string
  readonly VITE_OPENSKY_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

```

### FILE: tests/e2e.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Flydee/);
});

test('can login', async ({ page }) => {
  await page.goto('/');
  await page.click('text=INITIALIZE SYSTEM');
  // Mock login behavior or check for navigation
});

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rolldownOptions: {
        output: { manualChunks(id: string) {
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/@motionone')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@google/genai')) {
            return 'vendor-genai';
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor-react';
          }
        } },
      },
    },
  };
});

```

