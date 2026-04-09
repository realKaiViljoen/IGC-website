# Client Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-protected client portal with a live battle-map dashboard, CometChat messaging, and a reference feature — all consistent with the existing IGC design system.

**Architecture:** next-auth v5 credentials provider stores the client UID in the session; every protected server component reads that UID to load `data/clients/[uid].ts` and compute analytics at request time. The public site and portal share one Next.js app — a `PublicShell` client component conditionally suppresses the public Nav/Footer on `/portal/*` routes.

**Tech Stack:** Next.js 15 App Router, next-auth v5, bcryptjs, Tailwind CSS v4, Framer Motion, CometChat (existing TS arch), Vitest (analytics unit tests)

---

## Critical prerequisite — static export vs SSR

The project currently uses `output: 'export'` (fully static). next-auth v5 requires server-side API routes. **Task 1 removes the static export and switches to Netlify SSR.** This is a non-breaking change — all existing pages still build fine.

---

## File Map

**New files:**
```
types/client.ts                              — all shared types (ClientData, PipelineStage, MessageReference, AnalyticsResult)
types/next-auth.d.ts                         — session type augmentation (adds .user.id)
auth.ts                                      — next-auth instance (handlers, auth, signIn, signOut)
lib/auth/config.ts                           — credentials provider + JWT/session callbacks
lib/auth/clients.ts                          — client credential registry
lib/data.ts                                  — dynamic import of data/clients/[uid].ts
lib/analytics.ts                             — computeAnalytics() pure function
lib/analytics.test.ts                        — Vitest unit tests
data/clients/igc-demo-001.ts                 — seed client
vitest.config.ts                             — vitest config with @ alias
middleware.ts                                — next-auth route protection
app/portal/page.tsx                          — login page
app/portal/layout.tsx                        — minimal wrapper (no public nav)
app/portal/(app)/layout.tsx                  — sidebar shell for dashboard + messages
app/portal/(app)/dashboard/page.tsx          — battle-map server component
app/portal/(app)/messages/page.tsx           — CometChat messages page
components/portal/Sidebar.tsx                — sidebar nav + sign out
components/portal/DashboardHeader.tsx        — company, engagement, next update badge
components/portal/ConfidenceSignals.tsx      — 4 signal cards
components/portal/PipelineSection.tsx        — candidate rows with stage dots
components/portal/CommitmentsSection.tsx     — commitments list
components/portal/ActivityFeed.tsx           — activity timeline
components/portal/MessageComposer.tsx        — composer with reference button + state
components/portal/ReferencePicker.tsx        — sliding element picker panel
components/portal/ReferenceCard.tsx          — quoted reference block (in composer + in chat)
components/ui/PublicShell.tsx                — conditionally wraps Nav/Footer/Cursor
```

**Modified files:**
```
next.config.ts        — remove output:'export', remove trailingSlash
netlify.toml          — switch publish to .next, add @netlify/plugin-nextjs
package.json          — add next-auth, bcryptjs, @types/bcryptjs, vitest, @vitejs/plugin-react
app/layout.tsx        — replace Nav/Footer/Cursor with PublicShell
```

---

## Task 1: Switch from static export to SSR

**Files:**
- Modify: `next.config.ts`
- Modify: `netlify.toml`
- Modify: `package.json` (scripts only)

- [ ] **Step 1: Update next.config.ts**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 2: Update netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

- [ ] **Step 3: Verify build still works**

Run: `npm run build`
Expected: Build completes successfully. If you see errors about static params, add `export const dynamic = 'force-static'` to the offending page.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts netlify.toml
git commit -m "chore: switch from static export to SSR for portal support"
```

---

## Task 2: Install dependencies

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install auth and crypto packages**

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs vitest @vitejs/plugin-react
```

- [ ] **Step 2: Add test script to package.json**

In the `"scripts"` section of `package.json`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create vitest.config.ts at project root**

```ts
import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add next-auth, bcryptjs, vitest"
```

---

## Task 3: Types

**Files:**
- Create: `types/client.ts`
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: Create types/client.ts**

```ts
export type PipelineStage =
  | "sourced"
  | "submitted"
  | "interviewing"
  | "offer-extended"
  | "offer-accepted"
  | "placed"

export type ClientData = {
  uid: string
  company: string
  contactName: string
  contactEmail: string
  role: string
  engagement: {
    title: string
    startDate: string
    status: "active" | "on-hold" | "complete"
    consultant: string
  }
  metrics: {
    placementsMade: number
    candidatesSubmitted: number
    interviewsBooked: number
    offersExtended: number
  }
  pipeline: Array<{
    id: string
    name: string
    stage: PipelineStage
    lastUpdate: string
    note?: string
  }>
  commitments: Array<{
    promise: string
    due: string
    met: boolean
  }>
  activity: Array<{
    date: string
    entry: string
  }>
  nextUpdate: {
    date: string
    description: string
  }
}

export type MessageReference = {
  type: "pipeline" | "commitment" | "activity" | "signal"
  label: string
  detail: string
  id?: string
}

export type AnalyticsResult = {
  activeCandidatesThisWeek: number
  commitmentsMetCount: number
  commitmentsTotalCount: number
  daysToNextUpdate: number
  lastActivityDaysAgo: number
  closestToPlacement: { name: string; stage: PipelineStage } | null
  effortSignalThisMonth: number
}
```

- [ ] **Step 2: Create types/next-auth.d.ts**

```ts
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add types/
git commit -m "feat: add client portal types"
```

---

## Task 4: Seed client data

**Files:**
- Create: `data/clients/igc-demo-001.ts`

- [ ] **Step 1: Create data/clients/igc-demo-001.ts**

```ts
import type { ClientData } from "@/types/client"

export const client: ClientData = {
  uid: "igc-demo-001",
  company: "Aperture Medical",
  contactName: "Sarah Lowe",
  contactEmail: "sarah@aperture.com",
  role: "Practice Manager",
  engagement: {
    title: "Senior Dentist — 2x Positions",
    startDate: "2026-03-01",
    status: "active",
    consultant: "Viljoen",
  },
  metrics: {
    placementsMade: 1,
    candidatesSubmitted: 8,
    interviewsBooked: 3,
    offersExtended: 2,
  },
  pipeline: [
    {
      id: "c-001",
      name: "Dr. James Okafor",
      stage: "offer-accepted",
      lastUpdate: "2026-04-07",
      note: "Starting 1 May",
    },
    {
      id: "c-002",
      name: "Dr. Priya Mensah",
      stage: "interviewing",
      lastUpdate: "2026-04-08",
    },
    {
      id: "c-003",
      name: "Dr. Luca Ferreira",
      stage: "submitted",
      lastUpdate: "2026-04-06",
    },
  ],
  commitments: [
    {
      promise: "3 qualified candidates submitted within 14 days",
      due: "2026-03-15",
      met: true,
    },
    {
      promise: "Written update delivered every Friday",
      due: "2026-04-11",
      met: true,
    },
    {
      promise: "First placement within 60 days",
      due: "2026-04-30",
      met: false,
    },
  ],
  activity: [
    {
      date: "2026-04-08",
      entry: "Interview scheduled for Dr. Mensah — confirmed for 11 April.",
    },
    {
      date: "2026-04-07",
      entry: "Offer accepted by Dr. Okafor. Start date confirmed 1 May.",
    },
    {
      date: "2026-04-03",
      entry: "Dr. Ferreira submitted. CV and references sent to Sarah.",
    },
    {
      date: "2026-03-28",
      entry: "Interview completed — Dr. Okafor. Positive feedback from clinic.",
    },
    {
      date: "2026-03-14",
      entry: "3 candidates submitted ahead of deadline.",
    },
  ],
  nextUpdate: {
    date: "2026-04-16",
    description: "Week 6 pipeline review",
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add data/
git commit -m "feat: add demo client seed data"
```

---

## Task 5: Analytics engine + tests

**Files:**
- Create: `lib/analytics.ts`
- Create: `lib/analytics.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `lib/analytics.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { computeAnalytics } from "./analytics"
import type { ClientData } from "@/types/client"

const today = new Date().toISOString().split("T")[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
const oldDate = "2020-01-01"
const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

const mockClient: ClientData = {
  uid: "test-001",
  company: "Test Clinic",
  contactName: "Test User",
  contactEmail: "test@test.com",
  role: "Manager",
  engagement: { title: "Senior Dentist", startDate: "2026-03-01", status: "active", consultant: "Viljoen" },
  metrics: { placementsMade: 1, candidatesSubmitted: 8, interviewsBooked: 3, offersExtended: 2 },
  pipeline: [
    { id: "c1", name: "Dr. A", stage: "offer-accepted", lastUpdate: today },
    { id: "c2", name: "Dr. B", stage: "interviewing", lastUpdate: yesterday },
    { id: "c3", name: "Dr. C", stage: "submitted", lastUpdate: oldDate },
  ],
  commitments: [
    { promise: "3 candidates in 14 days", due: "2026-03-15", met: true },
    { promise: "Weekly update", due: "2026-04-09", met: true },
    { promise: "Placement in 60 days", due: "2026-04-30", met: false },
  ],
  activity: [
    { date: today, entry: "Offer accepted" },
    { date: "2026-04-03", entry: "Interview completed" },
  ],
  nextUpdate: { date: in7Days, description: "Week 6 review" },
}

describe("computeAnalytics", () => {
  it("counts only candidates updated within last 7 days", () => {
    const result = computeAnalytics(mockClient)
    expect(result.activeCandidatesThisWeek).toBe(2)
  })

  it("counts met commitments correctly", () => {
    const result = computeAnalytics(mockClient)
    expect(result.commitmentsMetCount).toBe(2)
    expect(result.commitmentsTotalCount).toBe(3)
  })

  it("calculates days to next update", () => {
    const result = computeAnalytics(mockClient)
    expect(result.daysToNextUpdate).toBe(7)
  })

  it("identifies closest-to-placement as highest stage candidate", () => {
    const result = computeAnalytics(mockClient)
    expect(result.closestToPlacement?.name).toBe("Dr. A")
    expect(result.closestToPlacement?.stage).toBe("offer-accepted")
  })

  it("returns null closestToPlacement for empty pipeline", () => {
    const result = computeAnalytics({ ...mockClient, pipeline: [] })
    expect(result.closestToPlacement).toBeNull()
  })

  it("counts last activity as today = 0 days ago", () => {
    const result = computeAnalytics(mockClient)
    expect(result.lastActivityDaysAgo).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL — `computeAnalytics` not found

- [ ] **Step 3: Implement lib/analytics.ts**

```ts
import type { ClientData, AnalyticsResult, PipelineStage } from "@/types/client"

const STAGE_ORDER: PipelineStage[] = [
  "sourced",
  "submitted",
  "interviewing",
  "offer-extended",
  "offer-accepted",
  "placed",
]

export function computeAnalytics(client: ClientData): AnalyticsResult {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeCandidatesThisWeek = client.pipeline.filter(
    (c) => new Date(c.lastUpdate) >= sevenDaysAgo
  ).length

  const commitmentsMetCount = client.commitments.filter((c) => c.met).length
  const commitmentsTotalCount = client.commitments.length

  const nextUpdateDate = new Date(client.nextUpdate.date)
  const daysToNextUpdate = Math.max(
    0,
    Math.ceil((nextUpdateDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  )

  const sortedActivity = [...client.activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const lastActivityDaysAgo =
    sortedActivity.length > 0
      ? Math.floor(
          (now.getTime() - new Date(sortedActivity[0].date).getTime()) /
            (24 * 60 * 60 * 1000)
        )
      : 0

  const closestToPlacement = client.pipeline.reduce<{
    name: string
    stage: PipelineStage
  } | null>((best, candidate) => {
    const currentIndex = STAGE_ORDER.indexOf(candidate.stage)
    const bestIndex = best ? STAGE_ORDER.indexOf(best.stage) : -1
    return currentIndex > bestIndex
      ? { name: candidate.name, stage: candidate.stage }
      : best
  }, null)

  const effortSignalThisMonth = client.activity.filter(
    (a) => new Date(a.date) >= startOfMonth
  ).length

  return {
    activeCandidatesThisWeek,
    commitmentsMetCount,
    commitmentsTotalCount,
    daysToNextUpdate,
    lastActivityDaysAgo,
    closestToPlacement,
    effortSignalThisMonth,
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```
Expected: 6 tests passing

- [ ] **Step 5: Commit**

```bash
git add lib/analytics.ts lib/analytics.test.ts
git commit -m "feat: add analytics engine with tests"
```

---

## Task 6: Auth config + client registry

**Files:**
- Create: `lib/auth/config.ts`
- Create: `lib/auth/clients.ts`
- Create: `auth.ts`

- [ ] **Step 1: Generate a hashed password for the demo client**

Run this once in a Node REPL to get the hash for password `"demo-password"`:

```bash
node -e "const b = require('bcryptjs'); console.log(b.hashSync('demo-password', 10))"
```

Copy the output hash — you'll paste it into clients.ts.

- [ ] **Step 2: Create lib/auth/clients.ts**

Replace `PASTE_HASH_HERE` with the hash from Step 1:

```ts
export type ClientCredential = {
  uid: string
  email: string
  hashedPassword: string
  contactName: string
}

// To add a new client:
// 1. node -e "const b = require('bcryptjs'); console.log(b.hashSync('their-password', 10))"
// 2. Add entry below with their uid, email, hash, and name
export const clients: ClientCredential[] = [
  {
    uid: "igc-demo-001",
    email: "sarah@aperture.com",
    hashedPassword: "PASTE_HASH_HERE",
    contactName: "Sarah Lowe",
  },
]
```

- [ ] **Step 3: Create lib/auth/config.ts**

```ts
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { clients } from "./clients"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/portal",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.uid = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.uid as string
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        const client = clients.find((c) => c.email === email)
        if (!client) return null
        const valid = await bcrypt.compare(password, client.hashedPassword)
        if (!valid) return null
        return {
          id: client.uid,
          email: client.email,
          name: client.contactName,
        }
      },
    }),
  ],
}
```

- [ ] **Step 4: Create auth.ts at project root**

```ts
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

- [ ] **Step 5: Create app/api/auth/[...nextauth]/route.ts**

```ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

- [ ] **Step 6: Commit**

```bash
git add lib/auth/ auth.ts app/api/
git commit -m "feat: add next-auth credentials config and client registry"
```

---

## Task 7: Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create middleware.ts at project root**

```ts
export { auth as default } from "@/auth"

export const config = {
  matcher: ["/portal/dashboard/:path*", "/portal/messages/:path*"],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware for portal routes"
```

---

## Task 8: PublicShell — suppress Nav/Footer on portal routes

**Files:**
- Create: `components/ui/PublicShell.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/ui/PublicShell.tsx**

```tsx
"use client"

import { usePathname } from "next/navigation"
import { Nav } from "./Nav"
import { Footer } from "./Footer"
import { Cursor } from "./Cursor"

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname.startsWith("/portal")

  return (
    <>
      {!isPortal && <Cursor />}
      {!isPortal && <Nav />}
      {children}
      {!isPortal && <Footer />}
    </>
  )
}
```

- [ ] **Step 2: Modify app/layout.tsx — replace Nav/Footer/Cursor with PublicShell**

Read the current `app/layout.tsx`. Replace the `<body>` contents as follows:

```tsx
// Remove these imports:
// import { Nav } from '@/components/ui/Nav'
// import { Footer } from '@/components/ui/Footer'
// import { Cursor } from '@/components/ui/Cursor'

// Add this import:
import { PublicShell } from '@/components/ui/PublicShell'

// Replace the body:
<body className="bg-[#080808] text-[#F2EDE4] antialiased">
  <div className="grain" aria-hidden="true" />
  <PublicShell>
    <MotionProvider>
      <main>{children}</main>
    </MotionProvider>
  </PublicShell>
</body>
```

- [ ] **Step 3: Verify public site still renders correctly**

Run: `npm run dev`
Navigate to `http://localhost:3000` — Nav and Footer should appear.
Navigate to `http://localhost:3000/portal` — Nav and Footer should be absent.

- [ ] **Step 4: Commit**

```bash
git add components/ui/PublicShell.tsx app/layout.tsx
git commit -m "feat: add PublicShell to suppress nav/footer on portal routes"
```

---

## Task 9: lib/data.ts — client data loader

**Files:**
- Create: `lib/data.ts`

- [ ] **Step 1: Create lib/data.ts**

```ts
import type { ClientData } from "@/types/client"

export async function getClientData(uid: string): Promise<ClientData | null> {
  try {
    const mod = await import(`@/data/clients/${uid}`)
    return (mod.client as ClientData) ?? null
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/data.ts
git commit -m "feat: add client data loader"
```

---

## Task 10: Login page

**Files:**
- Create: `app/portal/page.tsx`
- Create: `app/portal/layout.tsx`

- [ ] **Step 1: Create app/portal/layout.tsx**

This layout applies to the login page only (the authenticated pages use a nested layout). It sets the portal background without sidebar.

```tsx
export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-[#080808]">{children}</div>
}
```

- [ ] **Step 2: Create app/portal/page.tsx**

```tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PortalLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError("Invalid email or password.")
      setLoading(false)
    } else {
      router.push("/portal/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-playfair text-2xl text-[#F2EDE4] tracking-tight">IGC</span>
          <p className="text-[#4A4640] text-xs font-mono mt-1 tracking-wider uppercase">
            Client Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full bg-[#111110] border border-[#242220] text-[#F2EDE4] placeholder:text-[#4A4640] px-4 py-3 text-sm focus:outline-none focus:border-[#C9922A] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full bg-[#111110] border border-[#242220] text-[#F2EDE4] placeholder:text-[#4A4640] px-4 py-3 text-sm focus:outline-none focus:border-[#C9922A] transition-colors"
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#C9922A] text-[#C9922A] px-4 py-3 text-sm hover:bg-[#1F4D3A] hover:text-[#F2EDE4] hover:border-[#1F4D3A] transition-colors disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test login page renders**

Run: `npm run dev`
Navigate to `http://localhost:3000/portal` — login form should render with no Nav/Footer.

- [ ] **Step 4: Commit**

```bash
git add app/portal/
git commit -m "feat: add portal login page"
```

---

## Task 11: Portal shell layout (sidebar)

**Files:**
- Create: `components/portal/Sidebar.tsx`
- Create: `app/portal/(app)/layout.tsx`

- [ ] **Step 1: Create components/portal/Sidebar.tsx**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { label: "Dashboard", href: "/portal/dashboard", icon: "◈" },
  { label: "Messages", href: "/portal/messages", icon: "◎" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 flex-shrink-0 border-r border-[#242220] flex flex-col">
      <div className="px-5 py-5 border-b border-[#242220]">
        <span className="font-playfair text-lg text-[#F2EDE4]">IGC</span>
        <span className="block text-[#4A4640] text-xs font-mono mt-0.5 tracking-wider uppercase">
          Client Portal
        </span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "text-[#C9922A]"
                  : "text-[#857F74] hover:text-[#F2EDE4]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#C9922A]" />
              )}
              <span className="text-xs w-3">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 py-4 border-t border-[#242220]">
        <button
          onClick={() => signOut({ callbackUrl: "/portal" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#4A4640] hover:text-[#F2EDE4] transition-colors w-full"
        >
          <span className="text-xs w-3">→</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create app/portal/(app)/layout.tsx**

Note: route group `(app)` means the URL is still `/portal/dashboard`, not `/portal/(app)/dashboard`.

```tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/portal/Sidebar"

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/portal/Sidebar.tsx app/portal/\(app\)/layout.tsx
git commit -m "feat: add portal sidebar and authenticated layout"
```

---

## Task 12: Dashboard components

**Files:**
- Create: `components/portal/DashboardHeader.tsx`
- Create: `components/portal/ConfidenceSignals.tsx`
- Create: `components/portal/PipelineSection.tsx`
- Create: `components/portal/CommitmentsSection.tsx`
- Create: `components/portal/ActivityFeed.tsx`

- [ ] **Step 1: Create components/portal/DashboardHeader.tsx**

```tsx
import type { ClientData, AnalyticsResult } from "@/types/client"

interface Props {
  client: ClientData
  analytics: AnalyticsResult
}

export function DashboardHeader({ client, analytics }: Props) {
  const updateLabel =
    analytics.daysToNextUpdate === 0
      ? "Today"
      : `${analytics.daysToNextUpdate} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`

  return (
    <div className="border-b border-[#242220] px-8 py-6 flex items-start justify-between gap-6">
      <div>
        <h1 className="font-playfair text-2xl text-[#F2EDE4]">{client.company}</h1>
        <p className="text-[#857F74] text-sm mt-1">{client.engagement.title}</p>
        <p className="text-[#4A4640] text-xs mt-1 font-mono">
          Consultant: {client.engagement.consultant}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="inline-flex items-center gap-2 border border-[#242220] bg-[#111110] px-3 py-2">
          <span className="w-1.5 h-1.5 bg-[#C9922A] rounded-full" />
          <span className="text-[#F2EDE4] text-xs">
            Next update in {updateLabel}
          </span>
        </div>
        <p className="text-[#4A4640] text-xs mt-1.5">{client.nextUpdate.description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create components/portal/ConfidenceSignals.tsx**

```tsx
import type { AnalyticsResult } from "@/types/client"

function SignalCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-[#111110] border border-[#242220] px-5 py-4">
      <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="font-playfair text-xl text-[#F2EDE4]">{value}</p>
      {sub && <p className="text-[#857F74] text-xs mt-1">{sub}</p>}
    </div>
  )
}

interface Props {
  analytics: AnalyticsResult
}

export function ConfidenceSignals({ analytics }: Props) {
  const lastActivityText =
    analytics.lastActivityDaysAgo === 0
      ? "Today"
      : analytics.lastActivityDaysAgo === 1
      ? "Yesterday"
      : `${analytics.lastActivityDaysAgo} days ago`

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-8 py-6">
      <SignalCard
        label="Active this week"
        value={`${analytics.activeCandidatesThisWeek} candidate${analytics.activeCandidatesThisWeek !== 1 ? "s" : ""}`}
      />
      <SignalCard
        label="Commitments"
        value={`${analytics.commitmentsMetCount} of ${analytics.commitmentsTotalCount} met`}
        sub={
          analytics.commitmentsMetCount === analytics.commitmentsTotalCount
            ? "All on track"
            : undefined
        }
      />
      <SignalCard label="Last activity" value={lastActivityText} />
      <SignalCard
        label="Next update"
        value={`${analytics.daysToNextUpdate} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`}
        sub={`${analytics.effortSignalThisMonth} touchpoints this month`}
      />
    </div>
  )
}
```

- [ ] **Step 3: Create components/portal/PipelineSection.tsx**

```tsx
import type { ClientData, PipelineStage } from "@/types/client"

const STAGES: PipelineStage[] = [
  "sourced",
  "submitted",
  "interviewing",
  "offer-extended",
  "offer-accepted",
  "placed",
]

const STAGE_LABELS: Record<PipelineStage, string> = {
  sourced: "Sourced",
  submitted: "Submitted",
  interviewing: "Interviewing",
  "offer-extended": "Offer extended",
  "offer-accepted": "Offer accepted",
  placed: "Placed",
}

function StageBar({ currentStage }: { currentStage: PipelineStage }) {
  const currentIndex = STAGES.indexOf(currentStage)
  return (
    <div className="flex gap-1 items-center">
      {STAGES.map((stage, i) => (
        <div
          key={stage}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i < currentIndex
              ? "bg-[#857F74]"
              : i === currentIndex
              ? "bg-[#C9922A]"
              : "bg-[#242220]"
          }`}
        />
      ))}
    </div>
  )
}

interface Props {
  pipeline: ClientData["pipeline"]
}

export function PipelineSection({ pipeline }: Props) {
  if (pipeline.length === 0) return null

  return (
    <div className="mx-8 bg-[#111110] border border-[#242220]">
      <div className="px-5 py-4 border-b border-[#242220]">
        <h2 className="font-playfair text-[#F2EDE4]">Pipeline</h2>
      </div>
      <div className="divide-y divide-[#242220]">
        {pipeline.map((candidate) => (
          <div
            key={candidate.id}
            className="px-5 py-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[#F2EDE4] text-sm">{candidate.name}</p>
              {candidate.note && (
                <p className="text-[#857F74] text-xs mt-0.5">{candidate.note}</p>
              )}
            </div>
            <StageBar currentStage={candidate.stage} />
            <span className="text-[#857F74] text-xs w-28 text-right flex-shrink-0">
              {STAGE_LABELS[candidate.stage]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create components/portal/CommitmentsSection.tsx**

```tsx
import type { ClientData } from "@/types/client"

interface Props {
  commitments: ClientData["commitments"]
}

export function CommitmentsSection({ commitments }: Props) {
  if (commitments.length === 0) return null

  return (
    <div className="mx-8 bg-[#111110] border border-[#242220]">
      <div className="px-5 py-4 border-b border-[#242220]">
        <h2 className="font-playfair text-[#F2EDE4]">Commitments</h2>
      </div>
      <div className="divide-y divide-[#242220]">
        {commitments.map((c, i) => (
          <div key={i} className="px-5 py-4 flex items-start gap-4">
            <span
              className={`text-sm flex-shrink-0 mt-0.5 ${
                c.met ? "text-[#C9922A]" : "text-[#4A4640]"
              }`}
            >
              {c.met ? "✓" : "○"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[#F2EDE4] text-sm">{c.promise}</p>
              <p className="text-[#857F74] text-xs mt-0.5">Due {c.due}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create components/portal/ActivityFeed.tsx**

```tsx
import type { ClientData } from "@/types/client"

interface Props {
  activity: ClientData["activity"]
}

export function ActivityFeed({ activity }: Props) {
  if (activity.length === 0) return null

  const sorted = [...activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="mx-8 bg-[#111110] border border-[#242220]">
      <div className="px-5 py-4 border-b border-[#242220]">
        <h2 className="font-playfair text-[#F2EDE4]">Activity</h2>
      </div>
      <div className="divide-y divide-[#242220]">
        {sorted.map((item, i) => (
          <div key={i} className="px-5 py-4 flex items-start gap-5">
            <span className="text-[#4A4640] font-mono text-xs flex-shrink-0 mt-0.5 w-20">
              {item.date}
            </span>
            <p className="text-[#F2EDE4] text-sm">{item.entry}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/portal/DashboardHeader.tsx components/portal/ConfidenceSignals.tsx components/portal/PipelineSection.tsx components/portal/CommitmentsSection.tsx components/portal/ActivityFeed.tsx
git commit -m "feat: add dashboard section components"
```

---

## Task 13: Dashboard page

**Files:**
- Create: `app/portal/(app)/dashboard/page.tsx`

- [ ] **Step 1: Create app/portal/(app)/dashboard/page.tsx**

```tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { computeAnalytics } from "@/lib/analytics"
import { DashboardHeader } from "@/components/portal/DashboardHeader"
import { ConfidenceSignals } from "@/components/portal/ConfidenceSignals"
import { PipelineSection } from "@/components/portal/PipelineSection"
import { CommitmentsSection } from "@/components/portal/CommitmentsSection"
import { ActivityFeed } from "@/components/portal/ActivityFeed"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  const analytics = computeAnalytics(client)

  return (
    <div className="pb-12">
      <DashboardHeader client={client} analytics={analytics} />
      <ConfidenceSignals analytics={analytics} />
      <div className="space-y-4">
        <PipelineSection pipeline={client.pipeline} />
        <CommitmentsSection commitments={client.commitments} />
        <ActivityFeed activity={client.activity} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Test the full login → dashboard flow**

Run: `npm run dev`
1. Navigate to `http://localhost:3000/portal`
2. Log in with `sarah@aperture.com` / `demo-password`
3. Verify redirect to `/portal/dashboard`
4. Verify all sections render with seed data
5. Navigate to `http://localhost:3000/portal/dashboard` without session — verify redirect to `/portal`

- [ ] **Step 3: Commit**

```bash
git add app/portal/\(app\)/dashboard/
git commit -m "feat: add dashboard page"
```

---

## Task 14: Reference components

**Files:**
- Create: `components/portal/ReferenceCard.tsx`
- Create: `components/portal/ReferencePicker.tsx`

- [ ] **Step 1: Create components/portal/ReferenceCard.tsx**

```tsx
import type { MessageReference } from "@/types/client"

const TYPE_ICONS: Record<MessageReference["type"], string> = {
  pipeline: "●",
  commitment: "✓",
  activity: "◎",
  signal: "◈",
}

interface Props {
  reference: MessageReference
  onRemove?: () => void
}

export function ReferenceCard({ reference, onRemove }: Props) {
  return (
    <div className="flex items-start gap-3 bg-[#0D0D0C] border-l-2 border-[#C9922A] px-3 py-2">
      <span className="text-[#C9922A] text-xs mt-0.5 flex-shrink-0">
        {TYPE_ICONS[reference.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[#F2EDE4] text-xs leading-snug truncate">
          {reference.label}
        </p>
        <p className="text-[#857F74] text-xs">{reference.detail}</p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-[#4A4640] hover:text-[#F2EDE4] text-xs flex-shrink-0 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create components/portal/ReferencePicker.tsx**

```tsx
"use client"

import { motion } from "framer-motion"
import type { ClientData, MessageReference, PipelineStage } from "@/types/client"

const STAGE_LABELS: Record<PipelineStage, string> = {
  sourced: "Sourced",
  submitted: "Submitted",
  interviewing: "Interviewing",
  "offer-extended": "Offer extended",
  "offer-accepted": "Offer accepted",
  placed: "Placed",
}

interface Props {
  client: ClientData
  onSelect: (ref: MessageReference) => void
  onClose: () => void
}

export function ReferencePicker({ client, onSelect, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 right-0 mb-1 bg-[#111110] border border-[#242220] max-h-72 overflow-y-auto z-10"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242220] sticky top-0 bg-[#111110]">
        <span className="text-[#4A4640] text-xs font-mono uppercase tracking-wider">
          Reference a dashboard item
        </span>
        <button
          onClick={onClose}
          className="text-[#4A4640] hover:text-[#F2EDE4] text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Pipeline */}
      {client.pipeline.length > 0 && (
        <div className="px-4 py-3">
          <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
            Pipeline
          </p>
          {client.pipeline.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                onSelect({
                  type: "pipeline",
                  label: c.name,
                  detail: STAGE_LABELS[c.stage],
                  id: c.id,
                })
              }
              className="w-full text-left px-3 py-2 hover:bg-[#1A1918] transition-colors flex items-center justify-between"
            >
              <span className="text-[#F2EDE4] text-sm">{c.name}</span>
              <span className="text-[#857F74] text-xs">{STAGE_LABELS[c.stage]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Commitments */}
      {client.commitments.length > 0 && (
        <div className="px-4 py-3 border-t border-[#242220]">
          <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
            Commitments
          </p>
          {client.commitments.map((c, i) => (
            <button
              key={i}
              onClick={() =>
                onSelect({
                  type: "commitment",
                  label: c.promise,
                  detail: c.met ? "Met" : "Pending",
                  id: `commitment-${i}`,
                })
              }
              className="w-full text-left px-3 py-2 hover:bg-[#1A1918] transition-colors flex items-center justify-between gap-4"
            >
              <span className="text-[#F2EDE4] text-sm truncate">{c.promise}</span>
              <span
                className={`text-xs flex-shrink-0 ${
                  c.met ? "text-[#C9922A]" : "text-[#857F74]"
                }`}
              >
                {c.met ? "Met" : "Pending"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Activity */}
      {client.activity.length > 0 && (
        <div className="px-4 py-3 border-t border-[#242220]">
          <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
            Recent Activity
          </p>
          {client.activity.slice(0, 5).map((a, i) => (
            <button
              key={i}
              onClick={() =>
                onSelect({
                  type: "activity",
                  label: a.entry,
                  detail: a.date,
                  id: `activity-${i}`,
                })
              }
              className="w-full text-left px-3 py-2 hover:bg-[#1A1918] transition-colors"
            >
              <span className="text-[#F2EDE4] text-sm block">{a.entry}</span>
              <span className="text-[#4A4640] text-xs">{a.date}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/portal/ReferenceCard.tsx components/portal/ReferencePicker.tsx
git commit -m "feat: add reference card and picker components"
```

---

## Task 15: Message composer

**Files:**
- Create: `components/portal/MessageComposer.tsx`

- [ ] **Step 1: Create components/portal/MessageComposer.tsx**

```tsx
"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { ClientData, MessageReference } from "@/types/client"
import { ReferencePicker } from "./ReferencePicker"
import { ReferenceCard } from "./ReferenceCard"

interface Props {
  client: ClientData
  onSend: (text: string, reference?: MessageReference) => void
}

export function MessageComposer({ client, onSend }: Props) {
  const [text, setText] = useState("")
  const [reference, setReference] = useState<MessageReference | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  function handleSend() {
    if (!text.trim()) return
    onSend(text.trim(), reference ?? undefined)
    setText("")
    setReference(null)
    setPickerOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === "Escape") {
      setPickerOpen(false)
    }
  }

  const hasActiveReference = !!reference

  return (
    <div className="relative border-t border-[#242220] bg-[#080808]">
      {reference && (
        <div className="px-4 pt-3">
          <ReferenceCard reference={reference} onRemove={() => setReference(null)} />
        </div>
      )}

      <AnimatePresence>
        {pickerOpen && (
          <ReferencePicker
            client={client}
            onSelect={(ref) => {
              setReference(ref)
              setPickerOpen(false)
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className={`text-xs px-2.5 py-1 border transition-colors flex-shrink-0 ${
            pickerOpen || hasActiveReference
              ? "border-[#C9922A] text-[#C9922A]"
              : "border-[#242220] text-[#4A4640] hover:text-[#857F74] hover:border-[#4A4640]"
          }`}
        >
          Reference
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 bg-transparent text-[#F2EDE4] text-sm placeholder:text-[#4A4640] focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="text-xs px-3 py-1 border border-[#C9922A] text-[#C9922A] hover:bg-[#1F4D3A] hover:text-[#F2EDE4] hover:border-[#1F4D3A] transition-colors disabled:opacity-30 flex-shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/portal/MessageComposer.tsx
git commit -m "feat: add message composer with reference feature"
```

---

## Task 16: Messages page (CometChat scaffold)

**Files:**
- Create: `app/portal/(app)/messages/page.tsx`

This task scaffolds the messages page. The CometChat component itself is adapted from the user's existing TS architecture — the page provides the shell, the `onSend` handler that attaches reference metadata, and the correct layout.

- [ ] **Step 1: Create app/portal/(app)/messages/page.tsx**

```tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { MessagesClient } from "@/components/portal/MessagesClient"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  return (
    <MessagesClient
      client={client}
      consultantId="viljoen" // CometChat user ID for the consultant
      clientUserId={client.uid}
    />
  )
}
```

- [ ] **Step 2: Create components/portal/MessagesClient.tsx**

This is a client component shell. Wire your CometChat component in place of the `{/* CometChat messages list goes here */}` comment.

```tsx
"use client"

import { useCallback } from "react"
import type { ClientData, MessageReference } from "@/types/client"
import { MessageComposer } from "./MessageComposer"

interface Props {
  client: ClientData
  consultantId: string
  clientUserId: string
}

export function MessagesClient({ client, consultantId, clientUserId }: Props) {
  // Wire your CometChat send function here.
  // The reference is passed as CometChat message metadata.
  const handleSend = useCallback(
    (text: string, reference?: MessageReference) => {
      // Example CometChat call — adapt to your existing architecture:
      // sendCometChatMessage({
      //   receiverUID: consultantId,
      //   text,
      //   metadata: reference ? { reference } : undefined,
      // })
      console.log("send:", { text, reference })
    },
    [consultantId]
  )

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-[#242220] px-6 py-4 flex-shrink-0">
        <h1 className="font-playfair text-[#F2EDE4]">Messages</h1>
        <p className="text-[#857F74] text-xs mt-0.5">
          Direct line to your consultant
        </p>
      </div>

      {/* CometChat messages list goes here */}
      {/* Replace this div with your CometChat message list component */}
      {/* It receives consultantId and clientUserId as the conversation parties */}
      {/* For referenced messages, render ReferenceCard above the message text */}
      {/* using: message.metadata?.reference as MessageReference */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <p className="text-[#4A4640] text-sm text-center mt-8">
          Chat powered by CometChat — wire component here
        </p>
      </div>

      {/* Composer with reference feature */}
      <MessageComposer client={client} onSend={handleSend} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/portal/\(app\)/messages/ components/portal/MessagesClient.tsx
git commit -m "feat: add messages page scaffold with CometChat integration point"
```

---

## Task 17: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```
Expected: 6 tests passing (analytics engine)

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: Build completes with no errors. TypeScript errors are blocking — fix before proceeding.

- [ ] **Step 3: Full manual flow test**

Run: `npm run dev`

1. `http://localhost:3000` — public site loads with Nav + Footer, custom cursor active
2. `http://localhost:3000/portal` — login form, no Nav/Footer, no cursor
3. Log in as `sarah@aperture.com` / `demo-password` — redirects to `/portal/dashboard`
4. Dashboard shows: header with company + next update badge, 4 signal cards, pipeline with stage dots, commitments, activity feed
5. Click Messages in sidebar — messages page loads with composer
6. Click Reference button in composer — picker panel opens, shows pipeline/commitments/activity
7. Click a pipeline candidate — reference card attaches to composer
8. Send message — reference clears, `handleSend` called with text + reference object
9. Sign out — redirects to `/portal`
10. Navigate directly to `/portal/dashboard` — middleware redirects to `/portal`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete client portal v1 — auth, dashboard, messaging, reference feature"
```
