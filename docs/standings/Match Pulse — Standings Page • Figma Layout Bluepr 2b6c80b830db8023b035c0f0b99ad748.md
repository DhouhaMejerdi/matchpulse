# Match Pulse — Standings Page • Figma Layout Blueprint (Desktop / Tablet / Mobile)

**Format:** ASCII structural blueprint

**Use:** Paste in Figma → Recreate with Auto-Layout + Tokens

---

# 🖥️ **1. DESKTOP (1440px width)**

```
Frame: 1440 × Hug
Padding (horizontal): 80px
Grid: 12 columns / 24 gutter

┌───────────────────────────────────────────────────────────────┐
│  PAGE HEADER (Auto-layout: vertical)                          │
│                                                               │
│  Standings                             (text: --display-xl)   │
│  Current season • 28 matches played     (--text-sm muted)     │
│                                                               │
│  Spacing below: --s-8
├───────────────────────────────────────────────────────────────┤

│  FILTER BAR (Auto-layout: horizontal, gap: --s-4)             │
│                                                               │
│  [ League Selector Capsule ]  (44px height, --r-md)           │
│     ╰ crest 24×24                                              │
│     ╰ league name (--text-base)                                │
│     ╰ chevron                                                   │
│                                                               │
│  Spacing below: --s-6
├───────────────────────────────────────────────────────────────┤

│  LEGEND (Auto-layout: horizontal, gap: --s-6)                 │
│                                                               │
│   ● Champions League      ● Europa League      ● Relegation   │
│   (dots 12px, text --text-sm)                                │
│                                                               │
│  Spacing below: --s-8
├───────────────────────────────────────────────────────────────┤

│  STANDINGS TABLE WRAPPER (max-width: 1200px, centered)        │
│  Auto-layout: vertical                                         │
│                                                               │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ TABLE HEADER (height: 48px, bg: --surface-1)            │  │
│   │                                                         │  │
│   │  POS | TEAM | P | W | D | L | GD | PTS                  │  │
│   │     (header cells: --text-sm semibold)                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                               │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ TABLE ROW (48px height, bg: --surface-2)                │  │
│   │                                                         │  │
│   │  [zone strip 4px]  1   |  [crest32]  Team Name          │  │
│   │                     |   28 | 21 | 4 | 3 | +44 | 67       │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                               │
│   (Repeat 20 rows)                                             │
│                                                               │
└───────────────────────────────────────────────────────────────┘

```

---

# 📱 **2. MOBILE (375px width)**

**Mobile is scroll-first, simplified columns, sticky POS + TEAM.**

```
Frame: 375 × Hug
Padding: 16px horizontal

┌──────────────────────────────────────────┐
│  PAGE HEADER                              │
│   Standings                               │
│   Current season • 28 matches played      │
├──────────────────────────────────────────┤

│ [ League Selector Capsule ] (full width)  │
├──────────────────────────────────────────┤

│ LEGEND (horizontal, gap --s-4)           │
│ ● CL   ● EL   ● RE                       │
├──────────────────────────────────────────┤

│ HORIZONTAL SCROLL AREA (overflow-x)      │
│ ┌──────────────────────────────────────┐ │
│ │ TABLE (min-width: 600px)             │ │
│ │                                      │ │
│ │  POS | TEAM | PTS                     │ │
│ │                                      │ │
│ │  [4px strip] 1 | [crest24] Team | 67 │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

```

**Mobile Rules:**

- Hidden columns: P, W, D, L, GD
- Only show: POS, TEAM, PTS
- Row height: 44px
- Crest 24×24
- Row clickable area = entire width
- Horizontal scroll: friction 0, momentum on iOS

---

# 📒 **3. TABLE BLUEPRINT (Reusable in Figma Components)**

```
Component: Standings/TableRow  (width: 100%, height: 48px)
Auto-layout: horizontal, space-between, padding: --s-4

Row Structure:
[4px left stripe]  (variant: top4, europa, releg, default)

POS (center-aligned, 48px width)

TEAM CELL (auto-layout horizontal)
   [Crest 32x32]
   [Team Name — truncate]

NUMERIC VALUES (each cell right-aligned)
   P | W | D | L | GD | PTS

Row Hover: darken surface-2 by ~4%
Row Focus: inset 2px ring (--brand-500)
Row Divider: 1px --border-subtle

```

---

# 🧩 **4. Figma Component Naming & Structure**

Create a Figma component library:

```
Standings/
  ├─ Header
  ├─ LeagueSelector (shared)
  ├─ Legend
  │    ├─ LegendItem/CL
  │    ├─ LegendItem/EL
  │    └─ LegendItem/RE
  ├─ Table
  │    ├─ TableHeader
  │    ├─ TableRow (default)
  │    ├─ TableRow/top4
  │    ├─ TableRow/europa
  │    ├─ TableRow/relegation
  │    └─ TeamCell

```

All components must use **Auto-layout** and **Design Tokens**.

---

# 📐 **5. Vertical Rhythm (Spacing Tokens)**

- Header → Filters: `-s-8`
- Filters → Legend: `-s-6`
- Legend → Table: `-s-8`
- Row gaps: none (table style = continuous block)
- Page top: `-s-12`

---

# 🎯 **6. Developer Handoff Annotations**

Add these notes inside Figma:

```
• Table uses <table>, not divs.
• First column sticky on mobile.
• Horizontal scroll only on mobile.
• Row is interactive → role="link".
• Crest uses Next/Image <Image /> with fixed size.
• Tokens-only — no raw hex or px.

```

---

# 🧱 **7. Ready-to-Copy Figma Blocks (Direct Insertion)**

You can copy/paste these ASCII blocks directly into a Figma frame to use as structure overlays.

### A) Header Block

```
[Standings]
[Current season • 28 matches played]

```

### B) Filters Block

```
[  🇬🇧 Premier League  ▾ ]

```

### C) Legend Block

```
● Champions League   ● Europa League   ● Relegation

```

### D) Table Header

```
POS | TEAM | P | W | D | L | GD | PTS

```

### E) Example Row

```
[4px blue]  1  |  [crest32] Manchester City  | 28 | 21 | 4 | 3 | +44 | 67

```

### F) Mobile Row

```
[4px blue]  1 | [crest24] Manchester City | 67

```

---

# ✔️ This blueprint is now ready for:

- Figma auto-layout recreation
- Token application
- Component library setup
- Developer handoff
- QA verification