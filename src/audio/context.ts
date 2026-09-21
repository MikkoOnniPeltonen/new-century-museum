let context: AudioContext | null = null
const runningListeners = new Set<() => void>()

function notifyIfRunning() {
  if (context?.state === 'running') runningListeners.forEach((listener) => listener())
}

/** The shared AudioContext if one exists, without creating it (creating one before a gesture logs warnings). */
export function peekAudioContext(): AudioContext | null {
  return context
}

/** Lazily creates the shared AudioContext. Only call this from a user gesture. */
export function getAudioContext(): AudioContext | null {
  if (context) return context
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  context = new Ctor()
  context.addEventListener('statechange', notifyIfRunning)
  queueMicrotask(notifyIfRunning)
  return context
}

/** Called whenever the context becomes able to play sound. */
export function onAudioRunning(listener: () => void): () => void {
  runningListeners.add(listener)
  return () => runningListeners.delete(listener)
}

/** Call from a click/keydown handler so autoplay policies allow sound. */
export async function unlockAudio(): Promise<AudioContext | null> {
  const ctx = getAudioContext()
  if (ctx && ctx.state === 'suspended') await ctx.resume()
  notifyIfRunning()
  return ctx
}
