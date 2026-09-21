import { create } from 'zustand'

export type BurstTone = 'spark' | 'confetti'
export type ToastTone = 'success' | 'info' | 'error'

export interface Burst {
  id: number
  x: number
  y: number
  tone: BurstTone
}

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface EffectsState {
  bursts: Burst[]
  toasts: Toast[]
  burst: (x: number, y: number, tone?: BurstTone) => void
  toast: (message: string, tone?: ToastTone) => void
  dismissToast: (id: number) => void
}

const BURST_LIFETIME_MS = 1400
const TOAST_LIFETIME_MS = 3200

let nextId = 1

export const useEffects = create<EffectsState>()((set, get) => ({
  bursts: [],
  toasts: [],

  burst: (x, y, tone = 'spark') => {
    const id = nextId++
    set((state) => ({ bursts: [...state.bursts.slice(-6), { id, x, y, tone }] }))
    setTimeout(() => set((state) => ({ bursts: state.bursts.filter((b) => b.id !== id) })), BURST_LIFETIME_MS)
  },

  toast: (message, tone = 'success') => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message, tone }] }))
    setTimeout(() => get().dismissToast(id), TOAST_LIFETIME_MS)
  },

  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export const burstAt = (x: number, y: number, tone?: BurstTone) => useEffects.getState().burst(x, y, tone)
export const showToast = (message: string, tone?: ToastTone) => useEffects.getState().toast(message, tone)

/** Bursts from the center of an element, e.g. a card that was just matched. */
export function burstFrom(element: Element, tone?: BurstTone) {
  const rect = element.getBoundingClientRect()
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, tone)
}
