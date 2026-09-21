import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { unlockAudio } from '../../audio/context'
import { soundscape } from '../../audio/soundscape'
import { NEXT_WING_TRACK, TRACKS } from '../../audio/tracks'
import { useActiveCentury } from '../../lib/useActiveCentury'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import { useMuseum } from '../../store/museum'
import { useTheme } from '../../store/theme'

/** Keeps the music in step with the century on screen. Renders nothing. */
export function SoundscapeController() {
  const active = useActiveCentury()
  const { pathname } = useLocation()
  const preview = useTheme((state) => state.preview)
  const last = useTheme((state) => state.last)
  const enabled = useMuseum((state) => state.audio.enabled)
  const volume = useMuseum((state) => state.audio.volume)
  // Hovering a hall door previews its music, but only once the pointer settles.
  const century = useDebouncedValue(preview ?? active ?? last, 700)
  const track = pathname.replace(/\/$/, '') === '/next-wing' ? NEXT_WING_TRACK : TRACKS[century]

  useEffect(() => {
    soundscape.setVolume(volume)
  }, [volume])

  useEffect(() => {
    soundscape.setTrack(enabled ? track.src : null)
  }, [track, enabled])

  // Browsers allow audio only after a user gesture, so unlock on the first one anywhere.
  useEffect(() => {
    if (!enabled) return
    const unlock = () => void unlockAudio()
    const events = ['pointerdown', 'pointerup', 'keydown'] as const
    events.forEach((type) => window.addEventListener(type, unlock, { once: true }))
    return () => events.forEach((type) => window.removeEventListener(type, unlock))
  }, [enabled])

  useEffect(() => {
    const onVisibilityChange = () => soundscape.setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return null
}
