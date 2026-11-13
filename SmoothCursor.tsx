'use client'

import { useEffect, useRef } from 'react'

/* A smooth trail behind the mouse: an oxblood dot glides after the pointer and
   draws a soft ribbon behind it that tapers and fades from oxblood into emerald.
   The dot and the ribbon are painted together as one shape on a single canvas
   each frame, so they always move and fade as one. Over links and buttons the dot
   shrinks away so only the rose cursor shows. Only on devices with a mouse, and
   not for visitors who ask for less motion. */
const POINTS = 34 // how many steps the ribbon remembers: more makes it longer
const WIDTH = 12 // ribbon width at the dot, in px
const DOT = 7 // radius of the dot at the head, in px
const HEAD = 'rgb(163 36 58 / 95%)'

export default function SmoothCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mouse.matches || calm.matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
    }
    resize()
    // resizing wipes the canvas, so paint the dot back straight away
    const onResize = () => {
      resize()
      if (seen) paint()
    }

    const points = Array.from({ length: POINTS }, () => ({ x: -100, y: -100 }))
    const left = points.map(() => ({ x: 0, y: 0 }))
    const right = points.map(() => ({ x: 0, y: 0 }))
    let targetX = -100
    let targetY = -100
    let seen = false
    let hover = 0
    let hoverTarget = 0
    let raf = 0
    let last = 0
    let overCheck = 0

    /* One path: the ribbon's outline through both edges, rounded with curves between
       midpoints, plus the dot at its head, wound the same way so they fill as one */
    const outline = (spread: number, ribbon: boolean) => {
      const n = points.length
      const head = points[0]
      const r = DOT * (1 - hover) * spread
      ctx.beginPath()
      let clockwise = true
      if (ribbon) {
        for (let i = 0; i < n; i++) {
          const a = points[Math.max(0, i - 1)]
          const b = points[Math.min(n - 1, i + 1)]
          let tx = a.x - b.x
          let ty = a.y - b.y
          const len = Math.hypot(tx, ty) || 1
          tx /= len
          ty /= len
          const t = i / (n - 1)
          const half = ((WIDTH * Math.pow(1 - t, 0.85) + 0.6) / 2) * spread
          left[i].x = points[i].x - ty * half
          left[i].y = points[i].y + tx * half
          right[i].x = points[i].x + ty * half
          right[i].y = points[i].y - tx * half
        }
        ctx.moveTo(left[0].x, left[0].y)
        for (let i = 1; i < n - 1; i++) {
          ctx.quadraticCurveTo(left[i].x, left[i].y, (left[i].x + left[i + 1].x) / 2, (left[i].y + left[i + 1].y) / 2)
        }
        ctx.lineTo(points[n - 1].x, points[n - 1].y)
        ctx.lineTo(right[n - 1].x, right[n - 1].y)
        for (let i = n - 2; i > 0; i--) {
          ctx.quadraticCurveTo(right[i].x, right[i].y, (right[i].x + right[i - 1].x) / 2, (right[i].y + right[i - 1].y) / 2)
        }
        ctx.lineTo(right[0].x, right[0].y)
        ctx.closePath()
        // which way the outline turns where it meets the dot, so the dot joins it
        const ring = [left[0], left[1], right[1], right[0]]
        let area = 0
        for (let i = 0; i < 4; i++) {
          const p = ring[i]
          const q = ring[(i + 1) % 4]
          area += p.x * q.y - q.x * p.y
        }
        clockwise = area >= 0
      }
      if (r > 0.3) {
        ctx.moveTo(head.x + r, head.y)
        ctx.arc(head.x, head.y, r, 0, Math.PI * 2, !clockwise)
      }
    }

    const paint = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const head = points[0]
      const tail = points[points.length - 1]
      const ribbon = Math.hypot(head.x - tail.x, head.y - tail.y) >= 1
      if (!ribbon && hover > 0.97) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (ribbon) {
        const fade = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y)
        fade.addColorStop(0, HEAD)
        fade.addColorStop(0.55, 'rgb(80 200 120 / 55%)')
        fade.addColorStop(1, 'rgb(80 200 120 / 0%)')
        ctx.fillStyle = fade
      } else {
        ctx.fillStyle = HEAD
      }
      // a faint wide glow first, then the dot and ribbon themselves
      ctx.globalAlpha = 0.22
      outline(2.4, ribbon)
      ctx.fill()
      ctx.globalAlpha = 1
      outline(1, ribbon)
      ctx.fill()
    }

    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min(3, (now - last) / 16.667) : 1
      last = now
      let leadX = targetX
      let leadY = targetY
      let moving = false
      points.forEach((p, i) => {
        // each step eases towards the one in front of it, the same at any frame rate
        const ease = 1 - Math.pow(1 - (i === 0 ? 0.3 : 0.5), dt)
        p.x += (leadX - p.x) * ease
        p.y += (leadY - p.y) * ease
        if (Math.abs(leadX - p.x) + Math.abs(leadY - p.y) > 0.1) moving = true
        leadX = p.x
        leadY = p.y
      })
      hover += (hoverTarget - hover) * (1 - Math.pow(0.75, dt))
      if (Math.abs(hoverTarget - hover) > 0.01) moving = true
      else hover = hoverTarget
      paint()
      if (moving) raf = requestAnimationFrame(frame)
      else last = 0
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      targetX = event.clientX
      targetY = event.clientY
      if (!seen) {
        seen = true
        points.forEach((p) => {
          p.x = targetX
          p.y = targetY
        })
      }
      // what is under the pointer only needs checking a few times a second
      const t = performance.now()
      if (t - overCheck > 60) {
        overCheck = t
        const over = (event.target as Element | null)?.closest?.(
          'a, button, [role="button"], input, textarea, select, label, summary',
        )
        hoverTarget = over ? 1 : 0
      }
      root.classList.add('is-on')
      wake()
    }
    const onLeave = () => root.classList.remove('is-on')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return (
    <div ref={rootRef} className="smooth-cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="smooth-cursor__trail" />
    </div>
  )
}
