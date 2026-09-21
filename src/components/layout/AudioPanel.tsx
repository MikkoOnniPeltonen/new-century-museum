import { useId } from 'react'
import { useLocation } from 'react-router'
import { unlockAudio } from '../../audio/context'
import { NEXT_WING_TRACK, TRACKS } from '../../audio/tracks'
import { cn } from '../../lib/cn'
import { useActiveCentury } from '../../lib/useActiveCentury'
import { useMuseum } from '../../store/museum'
import { useTheme } from '../../store/theme'
import { PressableButton } from '../ui/Pressable'

/** Navbar sound button with a popover (native popover API) for mute, volume and track credits. */
export function AudioPanel() {
  const id = useId()
  const panelId = `audio-panel-${id}`
  const labelId = `audio-label-${id}`
  const enabled = useMuseum((state) => state.audio.enabled)
  const volume = useMuseum((state) => state.audio.volume)
  const setAudio = useMuseum((state) => state.setAudio)
  const active = useActiveCentury()
  const last = useTheme((state) => state.last)
  const { pathname } = useLocation()
  const track = pathname.replace(/\/$/, '') === '/next-wing' ? NEXT_WING_TRACK : TRACKS[active ?? last]

  return (
    <>
      <PressableButton
        variant="ghost"
        size="icon"
        aria-label="Sound settings"
        popoverTarget={panelId}
        onClick={() => void unlockAudio()}
      >
        <span className={cn('sound-bars', !enabled && 'is-muted')} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </PressableButton>

      <div id={panelId} popover="auto" className="audio-panel">
        <div className="audio-panel__row">
          <span id={labelId} className="audio-panel__title">
            Soundscape
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-labelledby={labelId}
            className="switch"
            onClick={() => {
              void unlockAudio()
              setAudio({ enabled: !enabled })
            }}
          >
            <span className="switch__thumb" />
          </button>
        </div>

        <label className="audio-panel__volume">
          <span>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            disabled={!enabled}
            onChange={(event) => setAudio({ volume: Number(event.target.value) })}
          />
        </label>

        <p className="audio-panel__now">
          <span className="eyebrow">Now playing</span>
          <strong>{track.title}</strong>
          <span>
            {track.composer} · {track.performer}
          </span>
          {track.sourceUrl ? <a href={track.sourceUrl} target="_blank" rel="noreferrer">
            {track.license} · Wikimedia Commons
          </a> : <span>{track.license}</span>}
        </p>
      </div>
    </>
  )
}
