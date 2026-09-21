import { motion } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { playSfx } from '../../audio/sfx'
import { CENTURIES } from '../../data/centuries'
import { cn } from '../../lib/cn'
import { centuryTarget } from '../../lib/navigation'
import { useActiveCentury } from '../../lib/useActiveCentury'
import { useTheme } from '../../store/theme'
import { Modal } from '../ui/Modal'
import { PressableButton } from '../ui/Pressable'
import { AudioPanel } from './AudioPanel'

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="currentColor">
      <path d="M32 8 7 21h50L32 8Z" />
      <rect x="9" y="23" width="46" height="4" rx="1" />
      <rect x="13" y="29" width="7" height="19" rx="1.5" />
      <rect x="28.5" y="29" width="7" height="19" rx="1.5" />
      <rect x="44" y="29" width="7" height="19" rx="1.5" />
      <rect x="7" y="50" width="50" height="6" rx="1.5" />
    </svg>
  )
}

function CenturySwitcher() {
  const { pathname } = useLocation()
  const active = useActiveCentury()

  return (
    <nav aria-label="Centuries" className="century-switcher">
      {CENTURIES.map((century) => {
        const selected = century === active
        return (
          <motion.span key={century} whileTap={{ scale: 0.88 }} transition={{ type: 'spring', stiffness: 600, damping: 18 }}>
            <Link
              to={centuryTarget(pathname, century)}
              className={cn('century-pill', selected && 'is-active')}
              aria-current={selected ? 'page' : undefined}
              onPointerDown={() => playSfx('tap')}
            >
              {selected && (
                <motion.span
                  layoutId="century-pill"
                  className="century-pill__bg"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className="century-pill__label">{century}</span>
            </Link>
          </motion.span>
        )
      })}
    </nav>
  )
}

function useLinks() {
  const active = useActiveCentury()
  const last = useTheme((state) => state.last)
  return [
    { to: '/', label: 'Hall', end: true },
    { to: '/timeline', label: 'Timeline', end: false },
    { to: `/map/${active ?? last}`, label: 'Map', end: false },
  ]
}

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = useLinks()

  return (
    <header className="nav">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" aria-label="Century Museum, back to the hall">
          <BrandMark />
          <span className="nav__brand-text">Century Museum</span>
        </Link>

        <CenturySwitcher />

        <nav aria-label="Main" className="nav__links">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn('nav__link', isActive && 'is-active')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <AudioPanel />

        <PressableButton
          variant="ghost"
          size="icon"
          className="nav__menu"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </PressableButton>
      </div>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="Explore" variant="drawer">
        <nav aria-label="Mobile" className="mobile-nav">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn('mobile-nav__link', isActive && 'is-active')}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </Modal>
    </header>
  )
}
