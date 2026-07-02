import { getTechIcon } from '../lib/techIcons'

/**
 * Renders a monochrome brand glyph for a tech/skill name, or nothing if the
 * name has no icon. Monochrome (currentColor) keeps the restrained teal palette;
 * pass `brand` to tint with the official brand color instead.
 */
export default function TechIcon({
  name,
  className = 'h-4 w-4',
  brand = false,
}: {
  name: string
  className?: string
  brand?: boolean
}) {
  const icon = getTechIcon(name)
  if (!icon) return null
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} ${brand ? '' : 'fill-current'}`}
      style={brand ? { fill: `#${icon.hex}` } : undefined}
    >
      <path d={icon.path} />
    </svg>
  )
}
