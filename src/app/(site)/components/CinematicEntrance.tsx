'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SerpentPoleEmblem from './SerpentPoleEmblem'

type CinematicEntranceProps = {
  onComplete: () => void
}

/* ------------------------------------------------------------------
   Rose garden entrance.
   Before Enter: black, the name, one button. Nothing moves.
   After Enter: hand drawn vines curl out of the letters and branch
   across the whole screen, with flat kitsch roses popping open along
   them and leaves sprouting either side. Then the whole garden grows
   backwards into the name, the name glides to its place on the
   homepage, and the black opens out from it like an iris onto the
   homepage underneath.

   Everything is drawn on a canvas from one clock, so growing and
   withdrawing are the same drawing played forwards and backwards.
   ------------------------------------------------------------------ */

/* Timeline, in seconds after Enter */
const GROW = 3.1 // the vines reach the edges of the screen
const POP = 0.5 // a rose takes this long to open
const HOLD_END = 4.2 // the screen stays full of roses until here
const RETRACT = 1.9 // the garden grows back into the name
const GLIDE_START = HOLD_END // the name and garden move together as retraction begins
const GLIDE = RETRACT
const OPEN_START = HOLD_END
const OPEN = RETRACT
const END = HOLD_END + RETRACT + 0.25

/* Colours: flat, like cut paper */
const VINE = '#0b7d55'
const ROSE = '#7c0a1c'
const ROSE_LINE = '#b52a40'
const ROSE_DEEP = '#4e0611'

type Pt = { x: number; y: number; t: number }
type Vine = { pts: Pt[]; w: number }
type Bloom = { x: number; y: number; r: number; rot: number; t: number; kind: number }
type Leaf = { x: number; y: number; len: number; rot: number; t: number }
type Garden = { vines: Vine[]; leaves: Leaf[]; roses: Bloom[]; growEnd: number }

/* Seeded random so the garden grows the same way every visit */
function makeRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
/* Springs a little past full size, then settles: the pop of a rose opening */
const popOut = (p: number) => {
  const c1 = 1.9
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2)
}

/* ---------- Growing the garden ----------
   Vines grow one small step at a time from tips that set out from the
   letters. A coarse grid remembers where vines have been, so new growth
   turns away from old growth and the screen fills evenly. Tips branch
   as they go and end in a rose or a curl. */
function growGarden(letters: DOMRect[], w: number, h: number): Garden {
  const rand = makeRandom(1987)
  const vmin = Math.min(w, h)
  const cell = Math.max(18, vmin * 0.046)
  const step = cell * 0.55
  const cols = Math.ceil(w / cell) + 4
  const rows = Math.ceil(h / cell) + 4
  const occ = new Int32Array(cols * rows).fill(-1)
  const roseOcc = new Uint8Array(cols * rows)
  const cellOf = (x: number, y: number) => {
    const c = Math.floor(x / cell) + 2
    const r = Math.floor(y / cell) + 2
    if (c < 0 || r < 0 || c >= cols || r >= rows) return -1
    return r * cols + c
  }

  const vines: Vine[] = []
  const leaves: Leaf[] = []
  const roses: Bloom[] = []
  const speed = (Math.hypot(w, h) * 0.5) / (GROW * 0.62)

  type Tip = {
    x: number
    y: number
    a: number
    t: number
    vine: number
    parent: number
    steps: number
    depth: number
    side: number
    curl: number
  }
  const tips: Tip[] = []

  const startVine = (x: number, y: number, a: number, t: number, depth: number, parent: number) => {
    const id = vines.length
    vines.push({ pts: [{ x, y, t }], w: Math.max(1.3, vmin * (0.0042 - depth * 0.0006)) })
    tips.push({
      x,
      y,
      a,
      t,
      vine: id,
      parent,
      steps: 0,
      depth,
      side: rand() < 0.5 ? 1 : -1,
      curl: (rand() - 0.5) * 0.16,
    })
  }

  const tryRose = (x: number, y: number, r: number, t: number) => {
    const span = Math.ceil(r / cell)
    const c0 = Math.floor(x / cell) + 2
    const r0 = Math.floor(y / cell) + 2
    for (let dy = -span; dy <= span; dy++)
      for (let dx = -span; dx <= span; dx++) {
        const c = c0 + dx
        const rr = r0 + dy
        if (c < 0 || rr < 0 || c >= cols || rr >= rows) continue
        if (roseOcc[rr * cols + c]) return false
      }
    const inner = Math.max(0, span - 2)
    for (let dy = -inner; dy <= inner; dy++)
      for (let dx = -inner; dx <= inner; dx++) {
        const c = c0 + dx
        const rr = r0 + dy
        if (c >= 0 && rr >= 0 && c < cols && rr < rows) roseOcc[rr * cols + c] = 1
      }
    roses.push({ x, y, r, rot: rand() * Math.PI * 2, t, kind: Math.floor(rand() * 6) })
    return true
  }

  /* A little curling tendril where a vine runs out of room */
  const addCurl = (tip: Tip) => {
    const pts: Pt[] = [{ x: tip.x, y: tip.y, t: tip.t }]
    let { x, y, a, t } = tip
    const dir = rand() < 0.5 ? 1 : -1
    const n = 12
    for (let j = 0; j < n; j++) {
      a += dir * (0.35 + j * 0.05)
      const s = step * 0.42 * (1 - j / (n + 4))
      x += Math.cos(a) * s
      y += Math.sin(a) * s
      t += s / speed
      pts.push({ x, y, t })
    }
    vines.push({ pts, w: Math.max(1.1, vmin * 0.0026) })
  }

  /* Two or three shoots from every letter, reaching up, down and outwards */
  const cx = w / 2
  letters.forEach((rect, i) => {
    const up = i % 2 === 0
    const x = rect.left + rect.width * (0.3 + rand() * 0.4)
    const y = up ? rect.top + rect.height * 0.2 : rect.bottom - rect.height * 0.2
    const out = Math.sign(x - cx) * 0.5
    const t = 0.05 + i * 0.045 + rand() * 0.08
    startVine(
      x,
      y,
      (up ? -Math.PI / 2 : Math.PI / 2) + out * (up ? 1 : -1) + (rand() - 0.5) * 0.7,
      t,
      0,
      -1,
    )
    if (i === 0 || i === letters.length - 1 || rand() < 0.4) {
      const sideways = x < cx ? Math.PI : 0
      startVine(x, rect.top + rect.height * 0.5, sideways + (rand() - 0.5) * 0.9, t + 0.1, 0, -1)
    }
  })

  const MAX_POINTS = 9000
  let points = 0
  while (tips.length && points < MAX_POINTS) {
    /* always grow the tip that is furthest behind in time, so the garden spreads as one wave */
    let best = 0
    for (let i = 1; i < tips.length; i++) if (tips[i].t < tips[best].t) best = i
    const tip = tips[best]
    tips[best] = tips[tips.length - 1]
    tips.pop()

    const vine = vines[tip.vine]
    let placed = false
    for (let attempt = 0; attempt < 4 && !placed; attempt++) {
      const turn = attempt === 0 ? 0 : (attempt % 2 ? 1 : -1) * (0.55 + attempt * 0.25)
      const a =
        tip.a + turn + (rand() - 0.5) * 0.5 + tip.curl + Math.sin(tip.steps * 0.6 + tip.vine) * 0.1
      const nx = tip.x + Math.cos(a) * step
      const ny = tip.y + Math.sin(a) * step
      if (nx < -cell * 1.5 || nx > w + cell * 1.5 || ny < -cell * 1.5 || ny > h + cell * 1.5) break
      const k = cellOf(nx, ny)
      const owner = k >= 0 ? occ[k] : -1
      const free = owner < 0 || owner === tip.vine || (tip.steps < 3 && owner === tip.parent)
      if (!free) continue
      placed = true
      const t = tip.t + (step / speed) * (1 + tip.depth * 0.04)
      vine.pts.push({ x: nx, y: ny, t })
      points++
      if (k >= 0) occ[k] = tip.vine
      tip.x = nx
      tip.y = ny
      tip.a = a
      tip.t = t
      tip.steps++
    }

    if (!placed || tip.steps > 90) {
      if (rand() < 0.72) {
        if (!tryRose(tip.x, tip.y, cell * (1.15 + rand() * 0.6), tip.t)) addCurl(tip)
      } else addCurl(tip)
      continue
    }

    /* leaves either side of the stem */
    if (tip.steps % 2 === 0 && rand() < 0.6) {
      tip.side = -tip.side
      leaves.push({
        x: tip.x,
        y: tip.y,
        len: cell * (0.55 + rand() * 0.35),
        rot: tip.a + tip.side * (0.75 + rand() * 0.45),
        t: tip.t,
      })
    }

    /* roses along the way, set just off the stem */
    if (tip.steps > 3 && rand() < 0.21) {
      const off = cell * 0.5 * (rand() < 0.5 ? 1 : -1)
      tryRose(
        tip.x - Math.sin(tip.a) * off,
        tip.y + Math.cos(tip.a) * off,
        cell * (0.9 + rand() * 0.5),
        tip.t + 0.05,
      )
    }

    /* branch */
    if (tip.steps > 2 && tips.length < 420 && rand() < 0.17 + (tip.depth === 0 ? 0.06 : 0)) {
      const dir = rand() < 0.5 ? 1 : -1
      startVine(
        tip.x,
        tip.y,
        tip.a + dir * (0.5 + rand() * 0.6),
        tip.t,
        Math.min(tip.depth + 1, 4),
        tip.vine,
      )
    }

    tips.push(tip)
  }

  /* Fill any gaps the vines missed with a few more roses */
  for (let y = cell; y < h; y += cell * 1.8)
    for (let x = cell; x < w; x += cell * 1.8) {
      const k = cellOf(x, y)
      if (k >= 0 && occ[k] >= 0) {
        const near = vines[occ[k]].pts.find(
          (p) => Math.abs(p.x - x) < cell && Math.abs(p.y - y) < cell,
        )
        if (near) tryRose(x, y, cell * (0.85 + rand() * 0.4), near.t + 0.1)
      }
    }

  /* A final illustrated canopy guarantees edge-to-edge rose coverage on every
     aspect ratio. It sits behind the organic vine roses and overlaps softly. */
  const coverStep = cell * 1.55
  const coverageRoses: Bloom[] = []
  for (let row = -1; row * coverStep < h + coverStep; row++) {
    for (let col = -1; col * coverStep < w + coverStep; col++) {
      const x =
        col * coverStep + (row % 2 ? coverStep * 0.5 : 0) + (rand() - 0.5) * coverStep * 0.18
      const y = row * coverStep + (rand() - 0.5) * coverStep * 0.18
      const dist = Math.hypot(x - w / 2, y - h / 2) / Math.hypot(w / 2, h / 2)
      coverageRoses.push({
        x,
        y,
        r: coverStep * (0.36 + rand() * 0.045),
        rot: rand() * Math.PI * 2,
        t: GROW * (0.55 + Math.min(1, dist) * 0.25) + rand() * 0.12,
        kind: Math.floor(rand() * 6),
      })
    }
  }
  roses.unshift(...coverageRoses)

  /* Spread the timing so the last of the growth lands at GROW */
  const times = vines.flatMap((v) => v.pts.map((p) => p.t)).sort((a, b) => a - b)
  const t95 = times[Math.floor(times.length * 0.95)] || 1
  const k = GROW / t95
  const fit = (t: number) => Math.min(GROW + 0.35, t * k)
  vines.forEach((v) => v.pts.forEach((p) => (p.t = fit(p.t))))
  leaves.forEach((l) => (l.t = fit(l.t)))
  roses.forEach((r) => (r.t = fit(r.t)))

  const growEnd = Math.max(...roses.map((r) => r.t + POP), GROW + 0.35)
  return { vines, leaves, roses, growEnd }
}

/* ---------- The pictures ----------
   Each rose is a wobbly scalloped blob with a hand drawn swirl, like a
   rose cut from paper and drawn over with a pen. Six of them are drawn
   once and reused. */
const ROSE_SPRITE = 256

function drawRose(seed: number) {
  const rand = makeRandom(seed * 977 + 5)
  const c = document.createElement('canvas')
  c.width = ROSE_SPRITE
  c.height = ROSE_SPRITE
  const g = c.getContext('2d')
  if (!g) return c
  const S = ROSE_SPRITE
  const R = S * 0.42
  g.translate(S / 2, S / 2)

  const lobes = 6 + Math.floor(rand() * 3)
  const ph = rand() * Math.PI * 2
  const wob = [rand() * 6, rand() * 6, rand() * 6]
  const outline = (scale: number) => {
    g.beginPath()
    for (let i = 0; i <= 120; i++) {
      const th = (i / 120) * Math.PI * 2
      const scallop = Math.pow(Math.abs(Math.sin((th * lobes + ph) / 2)), 0.55)
      const r =
        R *
        scale *
        (0.82 +
          0.15 * scallop +
          0.035 * Math.sin(th * 3 + wob[0]) +
          0.02 * Math.sin(th * 7 + wob[1]))
      const x = Math.cos(th) * r
      const y = Math.sin(th) * r * (0.94 + 0.04 * Math.sin(wob[2]))
      if (i === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.closePath()
  }

  outline(1)
  g.fillStyle = ROSE
  g.fill()

  /* a darker heart */
  g.beginPath()
  g.ellipse(R * 0.04, R * 0.02, R * 0.34, R * 0.3, rand(), 0, Math.PI * 2)
  g.fillStyle = ROSE_DEEP
  g.globalAlpha = 0.55
  g.fill()
  g.globalAlpha = 1

  g.strokeStyle = ROSE_LINE
  g.lineCap = 'round'
  g.lineJoin = 'round'

  /* the swirl: a wobbly spiral from the heart outwards */
  g.lineWidth = R * 0.075
  g.beginPath()
  const turns = 2.1 + rand() * 0.5
  const a0 = rand() * Math.PI * 2
  for (let i = 0; i <= 90; i++) {
    const u = i / 90
    const th = a0 + u * turns * Math.PI * 2
    const r = R * (0.05 + 0.6 * u) * (1 + 0.07 * Math.sin(u * 23 + a0))
    const x = Math.cos(th) * r + R * 0.03
    const y = Math.sin(th) * r * 0.92
    if (i === 0) g.moveTo(x, y)
    else g.lineTo(x, y)
  }
  g.stroke()

  /* two petal strokes near the rim */
  g.lineWidth = R * 0.06
  for (let k = 0; k < 2; k++) {
    const a = a0 + Math.PI * (0.6 + k * 0.9) + rand() * 0.5
    g.beginPath()
    g.arc(0, 0, R * (0.76 + rand() * 0.06), a, a + 0.7 + rand() * 0.4)
    g.stroke()
  }
  return c
}

const LEAF_W = 128
const LEAF_H = 64
function drawLeaf() {
  const c = document.createElement('canvas')
  c.width = LEAF_W
  c.height = LEAF_H
  const g = c.getContext('2d')
  if (!g) return c
  const L = LEAF_W - 4
  g.translate(2, LEAF_H / 2)
  g.beginPath()
  g.moveTo(0, 0)
  g.bezierCurveTo(L * 0.25, -L * 0.3, L * 0.7, -L * 0.24, L, 0)
  g.bezierCurveTo(L * 0.7, L * 0.2, L * 0.25, L * 0.26, 0, 0)
  g.fillStyle = VINE
  g.fill()
  return c
}

export default function CinematicEntrance({ onComplete }: CinematicEntranceProps) {
  const [started, setStarted] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const enterButtonRef = useRef<HTMLButtonElement>(null)
  const gardenRef = useRef<HTMLCanvasElement>(null)
  const veilRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    enterButtonRef.current?.focus({ preventScroll: true })
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    onComplete()
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
  }

  const enterSite = () => {
    if (started) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    setStarted(true)
  }

  useLayoutEffect(() => {
    if (!started) return
    const garden = gardenRef.current
    const veil = veilRef.current
    const title = titleRef.current
    if (!garden || !veil || !title) return

    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    for (const c of [garden, veil]) {
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
    }
    const g = garden.getContext('2d')
    const v = veil.getContext('2d')
    if (!g || !v) {
      finish()
      return
    }

    const ink =
      getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#151311'
    const paintVeil = (open: number, cx: number, cy: number) => {
      veil.style.opacity = (1 - open).toFixed(3)
      v.setTransform(dpr, 0, 0, dpr, 0, 0)
      v.globalCompositeOperation = 'source-over'
      v.clearRect(0, 0, w, h)
      v.fillStyle = ink
      v.fillRect(0, 0, w, h)
      if (open <= 0) return
      const far = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy))
      const r = far * 1.35 * open
      const soft = Math.max(40, Math.min(w, h) * 0.18)
      v.globalCompositeOperation = 'destination-out'
      const grad = v.createRadialGradient(cx, cy, Math.max(0, r - soft), cx, cy, r + 1)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      v.fillStyle = grad
      v.fillRect(0, 0, w, h)
      if (r - soft > 0) {
        v.beginPath()
        v.arc(cx, cy, r - soft, 0, Math.PI * 2)
        v.fillStyle = '#000'
        v.fill()
      }
    }
    paintVeil(0, w / 2, h / 2)

    /* Where the name sits now, and where it sits on the homepage */
    const introLine = title.querySelector<HTMLElement>('.garden__line')
    const heroLine = document.querySelector<HTMLElement>('.hero__name span')
    const from = (introLine ?? title).getBoundingClientRect()
    const to = heroLine?.getBoundingClientRect()
    const titleBox = title.getBoundingClientRect()
    const glide =
      to && to.width > 0
        ? {
            dx: to.left + to.width / 2 - (from.left + from.width / 2),
            dy: to.top + to.height / 2 - (from.top + from.height / 2),
            s: to.width / from.width,
          }
        : { dx: 0, dy: 0, s: 1 }
    const originX = from.left + from.width / 2
    const originY = from.top + from.height / 2
    title.style.transformOrigin = `${originX - titleBox.left}px ${originY - titleBox.top}px`
    garden.style.transformOrigin = `${originX}px ${originY}px`

    /* The serpent beneath the name travels with it, so it lands on the
       serpent in the showreel frame wherever that frame sits */
    const emblem = title.parentElement?.querySelector<HTMLElement>('.garden__emblem') ?? null
    if (emblem) {
      const emblemBox = emblem.getBoundingClientRect()
      emblem.style.transformOrigin = `${originX - emblemBox.left}px ${originY - emblemBox.top}px`
    }

    const letters = Array.from(title.querySelectorAll<HTMLElement>('.garden__letter')).map((el) =>
      el.getBoundingClientRect(),
    )
    const { vines, leaves, roses, growEnd } = growGarden(letters, w, h)
    const roseArt = Array.from({ length: 6 }, (_, i) => drawRose(i + 1))
    const leafArt = drawLeaf()
    const widths = Array.from(new Set(vines.map((vn) => vn.w))).sort((a, b) => b - a)

    /* The garden clock runs forwards while it grows, then backwards into the name */
    const peak = growEnd
    const clockAt = (t: number) => {
      if (t <= HOLD_END) return Math.min(t, peak)
      const p = clamp01((t - HOLD_END) / RETRACT)
      return peak * (1 - easeInOut(p))
    }

    const drawGarden = (c: number) => {
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.clearRect(0, 0, garden.width, garden.height)
      if (c <= 0) return
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.lineCap = 'round'
      g.lineJoin = 'round'
      g.strokeStyle = VINE
      for (const lw of widths) {
        g.lineWidth = lw
        g.beginPath()
        for (const vn of vines) {
          if (vn.w !== lw) continue
          const pts = vn.pts
          if (pts[0].t > c || pts.length < 2) continue
          /* a smooth pen line through the midpoints, so the vine curves rather than zigzags */
          g.moveTo(pts[0].x, pts[0].y)
          for (let i = 1; i < pts.length; i++) {
            const p = pts[i]
            const q = pts[i - 1]
            if (p.t <= c) {
              const nx = (q.x + p.x) / 2
              const ny = (q.y + p.y) / 2
              if (i === 1) g.lineTo(nx, ny)
              else g.quadraticCurveTo(q.x, q.y, nx, ny)
              if (i === pts.length - 1) g.lineTo(p.x, p.y)
              continue
            }
            const f = (c - q.t) / (p.t - q.t || 1)
            g.quadraticCurveTo(q.x, q.y, q.x + (p.x - q.x) * f, q.y + (p.y - q.y) * f)
            break
          }
        }
        g.stroke()
      }

      for (const l of leaves) {
        if (l.t >= c) continue
        const s = popOut(clamp01((c - l.t) / 0.32))
        const len = l.len * s
        if (len <= 0.5) continue
        const cos = Math.cos(l.rot)
        const sin = Math.sin(l.rot)
        const k = len / (LEAF_W - 4)
        g.setTransform(
          dpr * cos * k,
          dpr * sin * k,
          -dpr * sin * k,
          dpr * cos * k,
          dpr * l.x,
          dpr * l.y,
        )
        g.drawImage(leafArt, -2, -LEAF_H / 2)
      }

      for (const r of roses) {
        if (r.t >= c) continue
        const p = clamp01((c - r.t) / POP)
        const s = popOut(p)
        if (s <= 0.01) continue
        const rot = r.rot - (1 - p) * 1.4
        const k = ((r.r * 2) / (ROSE_SPRITE * 0.84)) * s * 1.16
        const cos = Math.cos(rot)
        const sin = Math.sin(rot)
        g.setTransform(
          dpr * cos * k,
          dpr * sin * k,
          -dpr * sin * k,
          dpr * cos * k,
          dpr * r.x,
          dpr * r.y,
        )
        g.globalAlpha = 0.94
        g.drawImage(roseArt[r.kind], -ROSE_SPRITE / 2, -ROSE_SPRITE / 2)
      }
      g.globalAlpha = 1
    }

    let lastClock = -1
    let lastMotion = -1
    let lastOpen = -1
    const t0 = performance.now()
    const frame = (now: number) => {
      const t = (now - t0) / 1000
      const c = clockAt(t)
      if (c !== lastClock) {
        drawGarden(c)
        lastClock = c
      }
      const motion = t < GLIDE_START ? 0 : easeInOut(clamp01((t - GLIDE_START) / GLIDE))
      if (motion !== lastMotion) {
        const x = glide.dx * motion
        const y = glide.dy * motion
        const scale = 1 + (glide.s - 1) * motion
        const transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(4)})`
        title.style.transform = transform
        garden.style.transform = transform
        const handoff = easeInOut(clamp01((motion - 0.72) / 0.28))
        title.style.opacity = (1 - handoff).toFixed(3)
        if (emblem) {
          emblem.style.transform = transform
          emblem.style.opacity = (1 - handoff).toFixed(3)
        }
        lastMotion = motion
      }
      const open = t < OPEN_START ? 0 : easeInOut(clamp01((t - OPEN_START) / OPEN))
      if (open !== lastOpen) {
        paintVeil(open, originX + glide.dx * motion, originY + glide.dy * motion)
        lastOpen = open
      }
      if (t >= END) {
        drawGarden(0)
        paintVeil(1, originX + glide.dx, originY + glide.dy)
        title.style.opacity = '0'
        if (emblem) emblem.style.opacity = '0'
        rafRef.current = requestAnimationFrame(finish)
        return
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    /* If the tab is hidden and frames stop, still let the visitor in */
    const safety = window.setTimeout(finish, (END + 3) * 1000)
    return () => {
      window.clearTimeout(safety)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  const words = [['Kassandra'], ['Stanley', 'Shostle']]

  return (
    <section
      className={`garden ${started ? 'is-growing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Enter Kassandra Stanley Shostle's portfolio"
    >
      <div className="garden__layer">
        <canvas ref={veilRef} className="garden__veil" aria-hidden="true" />
        <div className="garden__inner">
          <h1
            ref={titleRef}
            className="garden__title notranslate"
            aria-label="Kassandra Stanley Shostle"
            translate="no"
          >
            {words.map((line, li) => (
              <span
                key={li}
                className={`garden__line ${li === 0 ? 'garden__line--kassandra' : ''}`}
                aria-hidden="true"
              >
                {line.map((word, wi) => (
                  <span key={wi} className="garden__word">
                    {Array.from(word).map((ch, ci) => (
                      <span key={ci} className="garden__letter">
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <SerpentPoleEmblem className="garden__emblem" static />

          {/* Stays in place once pressed (just hidden), so the name never shifts */}
          <button
            ref={enterButtonRef}
            type="button"
            className="garden__enter"
            onClick={enterSite}
            disabled={started}
            aria-hidden={started}
          >
            Enter
          </button>
        </div>
        <canvas ref={gardenRef} className="garden__canvas" aria-hidden="true" />
      </div>
    </section>
  )
}
