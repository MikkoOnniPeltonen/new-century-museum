import { playSfx } from '../../audio/sfx'
import { CENTURY_INFO } from '../../data/centuries'
import type { Person } from '../../data/types'
import { imageEvidence } from '../../data/image-provenance'
import { lifespan } from '../../lib/persons'
import { showToast } from '../../store/effects'
import { useMuseum } from '../../store/museum'
import { PinIcon, PlusIcon } from '../ui/Icons'
import { Modal } from '../ui/Modal'
import { PressableButton, PressableLink } from '../ui/Pressable'
import { Portrait } from './Portrait'
import { HistoricalSources } from './HistoricalSources'

interface PersonDrawerProps {
  person: Person | null
  onClose: () => void
}

/** Side panel (bottom sheet on phones) with everything about one person. Used by the timeline and the map. */
export function PersonDrawer({ person, onClose }: PersonDrawerProps) {
  const rooms = useMuseum((state) => state.rooms)
  const addToRoom = useMuseum((state) => state.addToRoom)
  const removeFromRoom = useMuseum((state) => state.removeFromRoom)

  const inRoom = person ? rooms[person.century].includes(person.id) : false
  const info = person ? CENTURY_INFO[person.century] : null

  return (
    <Modal open={person !== null} onClose={onClose} variant="drawer" title={person?.name ?? ''}>
      {person && info && (
        <div className="person-drawer" data-theme={person.century}>
          <div className="person-drawer__frame gilt">
            <Portrait person={person} className="person-drawer__portrait" sizes="(min-width: 640px) 440px, 100vw" eager />
          </div>

          <p className="image-caption">{imageEvidence(person.id, 'portraits').label}</p>
          <div className="person-drawer__intro">
            <p className="eyebrow">
              {info.title} · {person.region}
            </p>
            <p className="person-drawer__meta">
              {lifespan(person)} · {person.profession}
            </p>
            <p className="person-drawer__location">
              <PinIcon /> {person.location.label}
            </p>
          </div>

          <p className="person-drawer__bio">{person.bio}</p>
          <HistoricalSources person={person} />

          <figure className="person-drawer__work">
            <Portrait person={person} kind="works" className="person-drawer__work-img" sizes="(min-width: 640px) 420px, 100vw" />
            <figcaption>
              <span className="eyebrow">Notable work</span>
              <strong>{person.work.title}</strong>
              <span>{person.work.description}</span>
              <span className="image-caption">{imageEvidence(person.id, 'works').label}</span>
            </figcaption>
          </figure>

          <div className="person-drawer__actions">
            {inRoom ? (
              <PressableButton
                variant="ghost"
                onClick={() => {
                  removeFromRoom(person.century, person.id)
                  showToast(`${person.name} left your ${info.ordinal} century room`, 'info')
                }}
              >
                Remove from room
              </PressableButton>
            ) : (
              <PressableButton
                burst
                onClick={() => {
                  addToRoom(person.century, person.id)
                  playSfx('success')
                  showToast(`${person.name} joined your ${info.ordinal} century room`)
                }}
              >
                <PlusIcon /> Add to room
              </PressableButton>
            )}
            <PressableLink to={`/map/${person.century}`} variant="ghost">
              Show on map
            </PressableLink>
            <PressableLink to={`/room/${person.century}`} variant="quiet">
              Open room
            </PressableLink>
          </div>
        </div>
      )}
    </Modal>
  )
}
