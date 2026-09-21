import { create } from 'zustand'
import type { Century } from '../data/centuries'

interface ThemeState {
  /** Temporary theme while hovering a door or playing the intro */
  preview: Century | null
  /** Most recently visited century, used on pages without one */
  last: Century
  setPreview: (century: Century | null) => void
  setLast: (century: Century) => void
}

export const useTheme = create<ThemeState>()((set) => ({
  preview: null,
  last: '1900s',
  setPreview: (preview) => set({ preview }),
  setLast: (last) => set({ last }),
}))
