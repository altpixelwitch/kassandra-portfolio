'use client'

import { useEffect, useState } from 'react'
import Particles from './Particles'

/* A night sky behind every page, in two layers so it has depth:
   - far away, a fine haze of very small, dim dust that barely moves
   - nearer, the brighter twinkling stars, with the odd oxblood and emerald speck
   The nearer layer slides a little more with the mouse than the far one, so the sky
   feels deep rather than flat. It waits until the intro has finished, so the intro
   never has to share the graphics card. */
const STARLIGHT = ['#efe8dd', '#efe8dd', '#efe8dd', '#f6f1ea', '#a3243a', '#50c878']

export default function SiteParticles() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(!document.querySelector('.garden'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`site-particles ${show ? 'is-on' : ''}`} aria-hidden="true">
      {show && (
        <>
          {/* Far: fine dust */}
          <Particles
            className="site-particles__layer"
            particleColors={['#efe8dd', '#efe8dd', '#d9cfc3', '#a3243a', '#50c878']}
            particleCount={1100}
            particleSpread={16}
            speed={0.03}
            particleBaseSize={50}
            sizeRandomness={1.2}
            maxSize={1.7}
            glow={0}
            twinkle={0.5}
            alphaParticles
            drift="up"
            driftSpeed={0.07}
            moveParticlesOnHover
            hoverEffect="parallax"
            particleHoverFactor={0.2}
            clickBurst={false}
            variation={3}
            opacity={0.6}
          />
          {/* Near: the brighter stars */}
          <Particles
            className="site-particles__layer"
            particleColors={STARLIGHT}
            particleCount={650}
            particleSpread={14}
            speed={0.05}
            particleBaseSize={70}
            sizeRandomness={1.6}
            maxSize={3.2}
            glow={0.25}
            twinkle={0.75}
            alphaParticles
            drift="up"
            driftSpeed={0.15}
            moveParticlesOnHover
            hoverEffect="parallax"
            particleHoverFactor={0.6}
            clickBurst={false}
            opacity={0.85}
          />
        </>
      )}
    </div>
  )
}
