'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'

/* A field of soft horizontal bands, lighter and darker in red. Used as a
   displacement map, it pushes each slice of the serpent left or right by a
   different amount; sliding the bands upward sends that ripple travelling up
   the body from tail to head, which is how a snake actually moves. */
const WAVE_PERIOD = 290 // in the drawing's own units (the pole is 1160 tall)
const waveStops = Array.from({ length: 17 }, (_, i) => {
  const t = i / 16
  const red = Math.round(128 + 127 * Math.sin(t * Math.PI * 2))
  return `<stop offset='${t.toFixed(4)}' stop-color='rgb(${red},128,128)'/>`
}).join('')
const WAVE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='468' height='1740'><defs><linearGradient id='w' x1='0' y1='0' x2='0' y2='${WAVE_PERIOD}' gradientUnits='userSpaceOnUse' spreadMethod='repeat'>${waveStops}</linearGradient></defs><rect width='468' height='1740' fill='url(#w)'/></svg>`,
)}`

export default function SerpentPoleEmblem({
  className = '',
  static: isStatic = false,
}: {
  className?: string
  static?: boolean
}) {
  const uid = useId().replaceAll(':', '')
  const filterID = `serpent-slither-${uid}`
  const maskID = `serpent-reveal-${uid}`
  const fadeID = `serpent-fade-${uid}`
  const poleLightID = `serpent-pole-light-${uid}`
  const frontID = `serpent-front-${uid}`
  const shaftID = `serpent-shaft-${uid}`
  const poleKeepID = `serpent-pole-keep-${uid}`
  const bodyID = `serpent-body-${uid}`
  const emblemRef = useRef<HTMLSpanElement>(null)
  const revealRef = useRef<SVGAnimateElement>(null)
  const [climbing, setClimbing] = useState(false)

  /* Each time the emblem comes on screen the serpent climbs onto the pole from
     the bottom, coil by coil, until its head reaches the top; then it keeps
     slithering. It climbs again the next time it comes into view. */
  useEffect(() => {
    if (isStatic) return
    const emblem = emblemRef.current
    if (!emblem) return
    if (!('IntersectionObserver' in window)) {
      setClimbing(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setClimbing(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(emblem)
    return () => observer.disconnect()
  }, [isStatic])

  /* The serpent slides up out of the dark from the foot of the pole, with a
     soft edge rather than a hard line */
  useEffect(() => {
    if (climbing) revealRef.current?.beginElement?.()
  }, [climbing])

  return (
    <span
      aria-hidden="true"
      className={`serpent-emblem ${
        isStatic ? 'serpent-emblem--static' : 'serpent-emblem--animated'
      }${climbing ? ' serpent-emblem--climbing' : ''} ${className}`.trim()}
      ref={emblemRef}
    >
      {isStatic ? (
        <Image
          alt=""
          className="serpent-emblem__complete"
          height={1160}
          priority
          src="/images/kassandra-serpent-pole.png"
          unoptimized
          width={468}
        />
      ) : (
        <>
          <svg
            aria-hidden="true"
            className="serpent-emblem__animated-art"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 468 1160"
          >
            <defs>
              <filter
                id={filterID}
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="1220"
                width="520"
                x="-26"
                y="-30"
              >
                <feImage
                  height="1740"
                  href={WAVE_IMAGE}
                  preserveAspectRatio="none"
                  result="slitherWave"
                  width="468"
                  x="0"
                  y="0"
                >
                  <animate
                    attributeName="y"
                    dur="2.2s"
                    from="0"
                    repeatCount="indefinite"
                    to={`-${WAVE_PERIOD}`}
                  />
                </feImage>
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="slitherWave"
                  result="moved"
                  scale="22"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                {/* Roundness: the body's outline, softened, is lit from the
                    upper left like a carved relief, so the snake reads as a
                    rounded body while keeping the drawn lines */}
                <feGaussianBlur in="moved" result="relief" stdDeviation="7" />
                <feDiffuseLighting
                  diffuseConstant="1.38"
                  in="relief"
                  lightingColor="#ffffff"
                  result="shade"
                  surfaceScale="6"
                >
                  <feDistantLight azimuth="225" elevation="46" />
                </feDiffuseLighting>
                <feComposite in="moved" in2="shade" k1="1" operator="arithmetic" result="shaded" />
                <feSpecularLighting
                  in="relief"
                  lightingColor="#fff6e2"
                  result="gloss"
                  specularConstant="0.8"
                  specularExponent="16"
                  surfaceScale="6"
                >
                  <feDistantLight azimuth="225" elevation="40" />
                </feSpecularLighting>
                <feComposite in="gloss" in2="moved" operator="in" result="glossOnBody" />
                <feComposite
                  in="glossOnBody"
                  in2="shaded"
                  k2="0.5"
                  k3="1"
                  operator="arithmetic"
                  result="body"
                />
                {/* A soft shadow the body casts onto the pole and the dark */}
                <feColorMatrix
                  in="moved"
                  result="shadowShape"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
                />
                <feGaussianBlur in="shadowShape" result="shadowSoft" stdDeviation="5" />
                <feOffset dx="9" dy="12" in="shadowSoft" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="body" />
                </feMerge>
              </filter>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="1220"
                id={poleLightID}
                width="520"
                x="-26"
                y="-30"
              >
                <feGaussianBlur in="SourceGraphic" result="relief" stdDeviation="9" />
                <feDiffuseLighting
                  diffuseConstant="1.38"
                  in="relief"
                  lightingColor="#ffffff"
                  result="shade"
                  surfaceScale="7"
                >
                  <feDistantLight azimuth="225" elevation="46" />
                </feDiffuseLighting>
                <feComposite in="SourceGraphic" in2="shade" k1="1" operator="arithmetic" result="shaded" />
                <feSpecularLighting
                  in="relief"
                  lightingColor="#fff6e2"
                  result="gloss"
                  specularConstant="0.7"
                  specularExponent="20"
                  surfaceScale="7"
                >
                  <feDistantLight azimuth="225" elevation="40" />
                </feSpecularLighting>
                <feComposite in="gloss" in2="SourceGraphic" operator="in" result="glossOnPole" />
                <feComposite in="glossOnPole" in2="shaded" k2="0.45" k3="1" operator="arithmetic" />
              </filter>
              {/* The flat drawing paints the coils that pass in front of the staff
                  (and the edges of the body beside it) onto the staff layer.
                  This lifts them off so they move with the serpent, on top. */}
              <mask height="1160" id={frontID} maskUnits="userSpaceOnUse" width="468" x="0" y="0">
                <rect fill="#fff" height="1160" width="468" />
                <rect fill="#000" height="140" width="468" x="0" y="0" />
                <path
                  d="M171 110 L245 110 L240 300 L233 450 L223 650 L215 800 L210 950 L206 1060 L200 1130 L190 1160 L180 1130 L176 1060 L174 800 L172 450 Z"
                  fill="#000"
                />
                <rect fill="#fff" height="142" width="180" x="120" y="536" />
                <rect fill="#fff" height="78" width="180" x="120" y="846" />
              </mask>
              {/* The bare staff: its knob and tapering shaft, without the bits of
                  coil the flat drawing painted onto it */}
              <clipPath id={shaftID}>
                <circle cx="207" cy="70" r="57" />
                <path d="M172 110 L244 110 L239 300 L232 450 L222 650 L214 800 L209 950 L205 1060 L199 1130 L190 1160 L181 1130 L177 1060 L175 800 L173 450 Z" />
              </clipPath>
              <mask height="1160" id={poleKeepID} maskUnits="userSpaceOnUse" width="468" x="0" y="0">
                <rect fill="#fff" height="1160" width="468" />
                <rect fill="#000" height="142" width="180" x="120" y="536" />
                <rect fill="#000" height="78" width="180" x="120" y="846" />
              </mask>
              <clipPath id={`${shaftID}-a`}>
                <rect height="142" width="180" x="120" y="536" />
              </clipPath>
              <clipPath id={`${shaftID}-b`}>
                <rect height="78" width="180" x="120" y="846" />
              </clipPath>
              {/* The serpent without the staff's silhouette and the knob's outline
                that the flat drawing traced into its layer */}
              <mask height="1220" id={bodyID} maskUnits="userSpaceOnUse" width="560" x="-46" y="-30">
                <rect fill="#fff" height="1220" width="560" x="-46" y="-30" />
                <rect fill="#000" height="162" width="560" x="-46" y="-30" />
                <path
                  d="M166 110 L250 110 L245 300 L238 450 L228 650 L220 800 L215 950 L211 1060 L205 1130 L190 1166 L175 1130 L171 1060 L169 800 L167 450 Z"
                  fill="#000"
                />
              </mask>
              <linearGradient id={fadeID} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#000" />
                <stop offset="0.07" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" />
              </linearGradient>
              <mask height="1300" id={maskID} maskUnits="userSpaceOnUse" width="560" x="-46" y="-70">
                <rect fill={`url(#${fadeID})`} height="2700" width="560" x="-46" y="1230">
                  <animate
                    ref={revealRef}
                    attributeName="y"
                    begin="indefinite"
                    calcMode="spline"
                    dur="3.2s"
                    fill="freeze"
                    from="1230"
                    keySplines="0.42 0 0.4 1"
                    keyTimes="0;1"
                    to="-1500"
                  />
                </rect>
              </mask>
            </defs>
            <g mask={`url(#${maskID})`}>
            <g className="serpent-emblem__serpent" filter={`url(#${filterID})`}>
              <image
                mask={`url(#${bodyID})`}
                height="1160"
                href="/images/kassandra-serpent-pole-serpent.png"
                width="468"
              />
            </g>
            </g>
            <g
              className="serpent-emblem__pole"
              clipPath={`url(#${shaftID})`}
              filter={`url(#${poleLightID})`}
            >
              <image
                height="1160"
                href="/images/kassandra-serpent-pole-pole.png"
                mask={`url(#${poleKeepID})`}
                width="468"
              />
              {/* Where the drawing had coil painted on the staff, plain staff
                  from just above fills in */}
              <g clipPath={`url(#${shaftID}-a)`}>
                <image height="1160" href="/images/kassandra-serpent-pole-pole.png" width="468" y="142" />
              </g>
              <g clipPath={`url(#${shaftID}-b)`}>
                <image height="1160" href="/images/kassandra-serpent-pole-pole.png" width="468" y="78" />
              </g>
            </g>
            {/* The coils that wrap round the front of the staff ride on top of
                it, so the serpent winds behind and in front */}
            <g mask={`url(#${maskID})`}>
              <g className="serpent-emblem__serpent">
                <g filter={`url(#${filterID})`}>
                  <image
                    height="1160"
                    href="/images/kassandra-serpent-pole-pole.png"
                    mask={`url(#${frontID})`}
                    width="468"
                  />
                </g>
              </g>
            </g>
          </svg>
          <Image
            alt=""
            className="serpent-emblem__reduced"
            height={1160}
            src="/images/kassandra-serpent-pole.png"
            unoptimized
            width={468}
          />
        </>
      )}
    </span>
  )
}
