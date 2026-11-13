import type { LanguageCode } from '../i18n/pageTranslator'

/* Small drawn flags for the language button and list. They are drawn here
   rather than using emoji flags, because Windows shows emoji flags as two
   letters (GB, FR ...) instead of the flag. */

const CN_STARS =
  'M5.00,2.00 L5.67,4.07 L7.85,4.07 L6.09,5.35 L6.76,7.43 L5.00,6.15 L3.24,7.43 L3.91,5.35 L2.15,4.07 L4.33,4.07Z M9.14,2.51 L9.62,1.97 L9.25,1.34 L9.91,1.63 L10.39,1.08 L10.33,1.80 L11.00,2.09 L10.29,2.25 L10.22,2.97 L9.85,2.35Z M11.01,4.14 L11.66,3.82 L11.56,3.10 L12.07,3.62 L12.72,3.30 L12.38,3.95 L12.88,4.47 L12.17,4.34 L11.83,4.99 L11.73,4.27Z M11.04,6.73 L11.76,6.70 L11.96,6.00 L12.21,6.68 L12.94,6.66 L12.37,7.10 L12.62,7.79 L12.01,7.38 L11.44,7.83 L11.64,7.13Z M9.22,8.38 L9.90,8.63 L10.35,8.06 L10.32,8.79 L11.00,9.05 L10.30,9.24 L10.26,9.96 L9.87,9.36 L9.16,9.55 L9.62,8.98Z'

function Stripes({ colours, vertical = false }: { colours: string[]; vertical?: boolean }) {
  const size = (vertical ? 30 : 20) / colours.length
  return (
    <>
      {colours.map((colour, index) =>
        vertical ? (
          <rect fill={colour} height="20" key={index} width={size} x={index * size} y="0" />
        ) : (
          <rect fill={colour} height={size} key={index} width="30" x="0" y={index * size} />
        ),
      )}
    </>
  )
}

function Trigram({ x, y, angle, bars }: { x: number; y: number; angle: number; bars: boolean[] }) {
  // Three bars; a broken bar is drawn as two halves
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {bars.map((whole, index) =>
        whole ? (
          <rect fill="#000" height="0.55" key={index} width="3.6" x="-1.8" y={-1.35 + index * 1} />
        ) : (
          <g key={index}>
            <rect fill="#000" height="0.55" width="1.6" x="-1.8" y={-1.35 + index * 1} />
            <rect fill="#000" height="0.55" width="1.6" x="0.2" y={-1.35 + index * 1} />
          </g>
        ),
      )}
    </g>
  )
}

function FlagShapes({ code }: { code: LanguageCode }) {
  switch (code) {
    case 'en':
      return (
        <>
          <rect fill="#012169" height="20" width="30" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="1.4" />
          <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="6" />
          <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.4" />
        </>
      )
    case 'fr':
      return <Stripes colours={['#0055A4', '#FFFFFF', '#EF4135']} vertical />
    case 'ru':
      return <Stripes colours={['#FFFFFF', '#0039A6', '#D52B1E']} />
    case 'es':
      return (
        <>
          <rect fill="#AA151B" height="20" width="30" />
          <rect fill="#F1BF00" height="10" width="30" y="5" />
        </>
      )
    case 'de':
      return <Stripes colours={['#000000', '#DD0000', '#FFCE00']} />
    case 'it':
      return <Stripes colours={['#009246', '#FFFFFF', '#CE2B37']} vertical />
    case 'ja':
      return (
        <>
          <rect fill="#FFFFFF" height="20" width="30" />
          <circle cx="15" cy="10" fill="#BC002D" r="6" />
        </>
      )
    case 'ko':
      return (
        <>
          <rect fill="#FFFFFF" height="20" width="30" />
          <g transform="rotate(33.7 15 10)">
            <circle cx="15" cy="10" fill="#0047A0" r="5" />
            <path d="M10,10 a5,5 0 0,1 10,0 a2.5,2.5 0 0,1 -5,0 a2.5,2.5 0 0,0 -5,0" fill="#CD2E3A" />
          </g>
          <Trigram angle={-56.3} bars={[true, true, true]} x={6.4} y={4.6} />
          <Trigram angle={56.3} bars={[true, false, true]} x={23.6} y={4.6} />
          <Trigram angle={56.3} bars={[false, true, false]} x={6.4} y={15.4} />
          <Trigram angle={-56.3} bars={[false, false, false]} x={23.6} y={15.4} />
        </>
      )
    case 'zh-CN':
      return (
        <>
          <rect fill="#EE1C25" height="20" width="30" />
          <path d={CN_STARS} fill="#FFFF00" />
        </>
      )
    default:
      return <rect fill="#888" height="20" width="30" />
  }
}

export default function LanguageFlag({
  className,
  code,
}: {
  className?: string
  code: LanguageCode
}) {
  return (
    <svg
      aria-hidden="true"
      className={`language-flag ${className ?? ''}`}
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 30 20"
    >
      <FlagShapes code={code} />
    </svg>
  )
}
