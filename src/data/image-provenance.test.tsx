import { render, screen, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Portrait } from '../components/person/Portrait'
import { ImageNotes } from '../components/person/ImageNotes'
import { getPerson, imageSrc, imageSrcSet, PERSONS } from '../lib/persons'
import { IMAGE_EVIDENCE, imageEvidence } from './image-provenance'

afterEach(cleanup)

describe('image evidence', () => {
  it('provides honest labels for all 40 displayed images', () => {
    for (const person of PERSONS) for (const kind of ['portraits', 'works'] as const) {
      expect(imageEvidence(person.id, kind).note.length).toBeGreaterThan(20)
      expect(imageEvidence(person.id, kind).label).toBeTruthy()
    }
    for (const id of Object.keys(IMAGE_EVIDENCE)) expect(getPerson(id)).toBeDefined()
  })

  it('cannot load withheld originals through src or srcset', () => {
    for (const [id, entries] of Object.entries(IMAGE_EVIDENCE)) {
      for (const kind of ['portraits', 'works'] as const) {
        if (!entries[kind]?.withheld) continue
        expect(imageSrc(kind, id)).toMatch(/^data:image\/svg\+xml,/)
        expect(decodeURIComponent(imageSrc(kind, id))).toContain('not a historical image')
        expect(imageSrcSet(kind, id)).toBe('')
      }
    }
  })

  it('keeps collection markers distinct for the matching game', () => {
    expect(imageSrc('portraits', 'anton-amo')).not.toBe(imageSrc('portraits', 'wang-zhenyi'))
    expect(imageSrc('portraits', 'anton-amo')).not.toBe(imageSrc('works', 'anton-amo'))
  })

  it('labels replacements accessibly while respecting decorative usage', () => {
    const person = getPerson('anton-amo')!
    const { rerender } = render(<Portrait person={person} />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringContaining('awaiting verification'))
    rerender(<Portrait person={person} alt="" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('exposes source links and separates rights from provenance', () => {
    render(<ImageNotes person={getPerson('nelson-mandela')!} />)
    expect(screen.getByText('About these images')).toBeInTheDocument()
    expect(screen.getByText(/1994, not a photograph taken during imprisonment/)).toBeInTheDocument()
    expect(screen.getByText(/rights review remains open/)).toBeInTheDocument()
  })

  it('retains ordinary image paths for images not withheld', () => {
    expect(imageSrc('works', 'voltaire')).toContain('images/works/voltaire-480.webp')
    expect(imageSrcSet('works', 'voltaire')).toContain('960w')
  })
})
