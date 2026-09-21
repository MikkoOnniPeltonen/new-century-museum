import { useMuseum } from '../store/museum'
import { getAudioContext } from './context'

export type SfxName = 'tap' | 'flip' | 'success' | 'error' | 'whoosh'

interface ToneRecipe {
  from: number
  to?: number
  duration: number
  type?: OscillatorType
  gain?: number
  delay?: number
}

/** Interface sounds are synthesized, so they need no audio files. */
const RECIPES: Record<SfxName, ToneRecipe[]> = {
  tap: [{ from: 640, to: 420, duration: 0.07, type: 'triangle', gain: 0.1 }],
  flip: [{ from: 260, to: 620, duration: 0.1, type: 'triangle', gain: 0.07 }],
  success: [
    { from: 659.25, duration: 0.2, type: 'triangle', gain: 0.14 },
    { from: 987.77, duration: 0.36, type: 'triangle', gain: 0.12, delay: 0.11 },
  ],
  error: [{ from: 210, to: 130, duration: 0.24, type: 'sawtooth', gain: 0.05 }],
  whoosh: [{ from: 160, to: 880, duration: 0.4, type: 'sine', gain: 0.05 }],
}

function playTone(ctx: AudioContext, destination: AudioNode, recipe: ToneRecipe) {
  const { from, to = from, duration, type = 'sine', gain = 0.1, delay = 0 } = recipe
  const start = ctx.currentTime + delay
  const oscillator = ctx.createOscillator()
  const envelope = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(from, start)
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration)
  envelope.gain.setValueAtTime(0.0001, start)
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012)
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  oscillator.connect(envelope).connect(destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.05)
}

export function playSfx(name: SfxName): void {
  const { enabled, volume } = useMuseum.getState().audio
  if (!enabled || volume <= 0) return
  const ctx = getAudioContext()
  if (!ctx) return

  const play = () => {
    const master = ctx.createGain()
    master.gain.value = volume
    master.connect(ctx.destination)
    for (const recipe of RECIPES[name]) playTone(ctx, master, recipe)
  }

  if (ctx.state === 'running') play()
  else ctx.resume().then(play, () => {})
}
