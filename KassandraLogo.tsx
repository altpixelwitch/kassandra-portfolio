import type { ComponentPropsWithoutRef, ElementType } from 'react'
import SerpentPoleEmblem from './SerpentPoleEmblem'

/* The one KASSANDRA / STANLEY SHOSTLE logo used across the site, matching the
   approved homepage version: "Kassandra" in Morpheus with the surname centred
   beneath it in oxblood capitals. Its proportions are fixed in styles.css
   (.kass-logo); each place only sets the overall size, so it scales as a whole. */
type LogoProps<T extends ElementType> = {
  as?: T
  className?: string
  /* The serpent on the pole slithers everywhere except where a still crest
     reads better (the showreel hero, which matches the still rose intro) */
  emblem?: 'animated' | 'still'
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export default function KassandraLogo<T extends ElementType = 'span'>({
  as,
  className = '',
  emblem = 'animated',
  ...rest
}: LogoProps<T>) {
  const Tag = (as ?? 'span') as ElementType
  return (
    <Tag className={`kass-logo notranslate ${className}`.trim()} translate="no" {...rest}>
      <span className="kass-logo__first">Kassandra</span>
      <span className="kass-logo__last">Stanley Shostle</span>
      <SerpentPoleEmblem className="kass-logo__emblem" static={emblem === 'still'} />
    </Tag>
  )
}
