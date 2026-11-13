'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/* Cinema slides, on every page (not the rose intro).

   Each section is revealed through a window: it starts as a narrow opening in
   the middle of the screen, with a band across the top, and the opening widens
   to the full section as it scrolls into place (the way a projector's masking
   opens). Sections already on screen when a page opens do this by themselves.

   On the homepage, on wide screens, each section that fits on the screen is
   also a slide: it holds in place while the next one rises over it, and sinks
   back into the dark as it is covered.

   The particles show around every window, because nothing here paints over
   them. People who ask their device to reduce motion see the pages as they
   were. */

const TARGETS = [
  '[data-zoom]', // homepage sections
  '.works-page__intro',
  '.works-page > .panel',
  '.works-card',
  '.award-card',
  '.news-card',
  '.news-detail',
  '.about__opening',
  '.about__quote',
  '.about__chapter',
  '.legal-page > section',
  '.contact-page__methods',
  '.contact-page__form',
  '.works-page__empty',
].join(',')

const OPENING_TIME = 1400 // ms for sections already on screen to open
const SLIDE_MIN_WIDTH = 900 // slides hold in place on screens at least this wide

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export default function ScrollZoom() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    root.classList.add('has-zoom')

    let sections: HTMLElement[] = []
    let slides: HTMLElement[] = []
    const openingSince = new Map<HTMLElement, number>()
    const tilted = new WeakSet<HTMLElement>()
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let frame = 0

    /* The window opens from just above a section's first line, not from the
       top of its spacing */
    const measure = (section: HTMLElement) => {
      const first = section.firstElementChild as HTMLElement | null
      const top = first ? Math.max(0, first.offsetTop - 28) : 0
      section.style.setProperty('--frame-top', `${top}px`)
    }

    /* The top spacing a section loses when it becomes a full-screen slide */
    const slideTrim = (section: HTMLElement) =>
      Math.max(0, parseFloat(getComputedStyle(section).paddingTop) - 96)

    /* Homepage slide: the showreel holds while Films rises over it. The
       sections after it follow one another closely rather than each
       filling the screen, so there are no large empty gaps between them */
    const chooseSlides = () => {
      slides.forEach((slide) => slide.classList.remove('is-slide', 'is-covered'))
      slides = []
      if (window.innerWidth < SLIDE_MIN_WIDTH) return
      const hero = document.querySelector<HTMLElement>('.site > .hero')
      if (!hero) return // slides are for the homepage only
      const candidates = [hero]
      for (const candidate of candidates) {
        if (!candidate) continue
        // A slide fills the screen, so only sections whose content fits on
        // one screen become slides
        if (candidate !== hero && candidate.scrollHeight - slideTrim(candidate) > window.innerHeight) continue
        candidate.classList.add('is-slide')
        slides.push(candidate)
      }
    }

    const update = () => {
      frame = 0
      const now = performance.now()
      const height = window.innerHeight
      const scrolled = window.scrollY
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - height)
      let stillOpening = false

      for (const section of sections) {
        const frameTop = parseFloat(section.style.getPropertyValue('--frame-top')) || 0
        const top = section.getBoundingClientRect().top + frameTop
        // 0 as the section rises above the bottom of the screen, 1 once it is
        // in place: at the top for a slide, halfway up for anything else, or
        // as high as the page lets it go
        const pageTop = top + scrolled
        // (a held slide stops with its first line just below the top)
        const resting = section.classList.contains('is-slide') ? frameTop : height * 0.5
        const highest = Math.max(Math.min(resting, pageTop), pageTop - maxScroll)
        let progress = clamp01((height - top) / Math.max(1, height - highest))
        // A held slide that is sinking back stays fully open (its shrinking
        // would otherwise read as moving down)
        if (parseFloat(section.style.getPropertyValue('--cover')) > 0) {
          progress = Math.max(progress, parseFloat(section.style.getPropertyValue('--zoom')) || 0)
        }

        const since = openingSince.get(section)
        if (since !== undefined) {
          const t = Math.min(1, (now - since) / OPENING_TIME)
          progress = Math.min(progress, easeOut(t))
          if (t < 1) stillOpening = true
          else openingSince.delete(section)
        }

        section.style.setProperty('--zoom', progress.toFixed(3))
        section.classList.toggle('is-full', progress >= 0.999)
        // One-off touches (rolling years, the marquee) play once, when a
        // section is nearly open
        if (progress > 0.85) section.classList.add('is-open')
      }

      /* A held slide sinks back as whatever comes next rises over it */
      for (const slide of slides) {
        const next = (slide.nextElementSibling ??
          slide.parentElement?.nextElementSibling) as HTMLElement | null
        const nextSection = slide.classList.contains('hero')
          ? document.querySelector<HTMLElement>('main > section')
          : next
        if (!nextSection) continue
        const nextTop =
          nextSection.getBoundingClientRect().top +
          (parseFloat(nextSection.style.getPropertyValue('--frame-top')) || 0)
        // Fully gone by the time the next section's first line is 40% of the
        // way up, so the two never read over each other
        const height = window.innerHeight
        const cover = clamp01((height - nextTop) / (height * 0.6))
        slide.style.setProperty('--cover', cover.toFixed(3))
        slide.classList.toggle('is-covered', cover >= 0.97)
      }

      if (stillOpening) frame = requestAnimationFrame(update)
    }

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    /* The film poster leans very slightly towards the mouse */
    const addTilt = (poster: HTMLElement) => {
      if (!finePointer || tilted.has(poster)) return
      tilted.add(poster)
      poster.addEventListener('pointermove', (event) => {
        const box = poster.getBoundingClientRect()
        const x = (event.clientX - box.left) / box.width - 0.5
        const y = (event.clientY - box.top) / box.height - 0.5
        poster.style.setProperty('--tilt-x', `${(x * 6).toFixed(2)}deg`)
        poster.style.setProperty('--tilt-y', `${(-y * 6).toFixed(2)}deg`)
      })
      poster.addEventListener('pointerleave', () => {
        poster.style.setProperty('--tilt-x', '0deg')
        poster.style.setProperty('--tilt-y', '0deg')
      })
    }

    /* Finds the sections on whatever page is showing; new ones already on
       screen open by themselves */
    const scan = () => {
      const found = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(
        (element) => !element.closest('.garden') && !element.parentElement?.closest(TARGETS),
      )
      const now = performance.now()
      for (const section of found) {
        if (sections.includes(section)) continue
        section.setAttribute('data-zoom', '')
        measure(section)
        if (section.getBoundingClientRect().top < window.innerHeight) openingSince.set(section, now)
      }
      sections = found
      chooseSlides()
      sections.forEach(measure)
      document.querySelectorAll<HTMLElement>('[data-zoom] .work__poster').forEach(addTilt)
      request()
    }

    let scanTimer = 0
    const scanSoon = () => {
      window.clearTimeout(scanTimer)
      scanTimer = window.setTimeout(scan, 60)
    }

    const onResize = () => {
      sections.forEach(measure)
      chooseSlides()
      request()
    }

    scan()
    const observer = new MutationObserver(scanSoon)
    observer.observe(document.body, { childList: true, subtree: true })
    // capture: true catches scrolling whichever element is doing it
    document.addEventListener('scroll', request, { capture: true, passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(scanTimer)
      observer.disconnect()
      document.removeEventListener('scroll', request, { capture: true })
      window.removeEventListener('resize', onResize)
      slides.forEach((slide) => slide.classList.remove('is-slide', 'is-covered'))
      root.classList.remove('has-zoom')
    }
  }, [pathname])

  return null
}
