import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { STORIES, type Story, type Choice } from './stories'
import { readExhibit, saveExhibit, type Exhibit } from './exhibit'
import { ChallengeIllustration } from './ChallengeIllustration'
import { discoverRole } from './roles'

export function NextWingPage() {
  useDocumentTitle('The Next Wing · Your century')
  const [story, setStory] = useState<Story | null>(null)
  const [choices, setChoices] = useState<Choice[]>([])
  const [selected, setSelected] = useState<Choice | null>(null)
  const [exhibit, setExhibit] = useState<Exhibit | null>(readExhibit)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(true)
  const [finished, setFinished] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [story?.id, choices.length, finished])
  const start = (next: Story) => { setStory(next); setChoices([]); setSelected(null); setFinished(false) }
  const chapter = story?.chapters[choices.length]
  const exhibitStory = STORIES.find((item) => item.title === exhibit?.challenge)
  const exhibitChoices = exhibitStory?.chapters.flatMap((item) => item.choices.filter((choice) => exhibit?.choices.includes(choice.title))) ?? []
  const exhibitRole = exhibitStory && exhibitChoices.length ? discoverRole(exhibitStory, exhibitChoices) : null
  const advance = () => {
    if (!story || !selected) return
    const next = [...choices, selected]
    setChoices(next)
    setSelected(null)
    if (next.length === story.chapters.length) {
      const { title } = discoverRole(story, next)
      const result = { name: name.trim() || 'You', title, challenge: story.title, choices: next.map((choice) => choice.title), action: story.action }
      setSaved(saveExhibit(result)); setExhibit(result); setFinished(true)
    }
  }
  return (
    <section className="future-wing" aria-labelledby="future-title">
      <div className="future-wing__grid" aria-hidden="true" />
      <header className="future-wing__header">
        <p className="eyebrow">The 21st century · 2000s</p>
        <h1 id="future-title">History is still<br /><em>being written.</em></h1>
        <p>The next wing has no finished exhibition. You are one of the people writing it.</p>
        <Link to="/">← Back to the museum</Link>
      </header>
      {!story && <>
        <div className="future-wing__invitation"><span>YOUR CHAPTER</span><h2>What would you change?</h2><p>Choose a fictional challenge. Make three decisions, see their consequences, and discover the kind of change you can bring. There is no perfect score.</p></div>
        <div className="future-choices">{STORIES.map((item) => <button key={item.id} className="future-choice" onClick={() => start(item)}><span>{item.symbol} / {item.subtitle}</span><h3>{item.title}</h3></button>)}</div>
        {exhibit && <aside className="future-saved"><p>Your latest exhibit</p><h2>{exhibit.name} — {exhibitRole?.title ?? exhibit.title}</h2><p>{exhibit.challenge}</p><button className="future-button" onClick={() => { setFinished(true); setStory(STORIES.find((item) => item.title === exhibit.challenge) || STORIES[0]) }}>View your exhibit</button></aside>}
      </>}
      {story && !finished && chapter && <motion.div key={`${story.id}-${choices.length}`} className="future-story" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="future-story__top"><p>{story.subtitle}</p><p>Decision {choices.length + 1} of 3</p></div>
        <progress aria-label="Story progress" max={3} value={choices.length} />
        {choices.length > 0 && <aside className="future-consequence"><strong>Your story so far</strong><p>{choices[choices.length - 1].outcome}</p></aside>}
        <h2 tabIndex={-1} ref={heading}>{chapter.question}</h2>
        <p>{chapter.context}</p>
        <div className="future-options" role="group" aria-label="Choose your action">{chapter.choices.map((choice, index) => <button key={choice.title} aria-pressed={selected === choice} onClick={() => setSelected(choice)}><span>0{index + 1}</span>{choice.title}</button>)}</div>
        {selected && <div className="future-consequence" role="status"><strong>What happens next</strong><p>{selected.outcome}</p></div>}
        {choices.length === 2 && <label className="future-name">Name on your exhibit (optional)<input value={name} maxLength={50} placeholder="You" onChange={(event) => setName(event.target.value)} autoComplete="off" /><small>Saved only in this browser.</small></label>}
        <div className="future-story__actions"><button className="future-button" disabled={!selected} onClick={advance}>{choices.length === 2 ? 'Reveal my exhibit' : 'Continue the story'} →</button><button className="future-text-button" onClick={() => setStory(null)}>Choose another challenge</button></div>
      </motion.div>}
      {finished && exhibit && <motion.div className="future-exhibit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ChallengeIllustration challenge={exhibit.challenge} />
        <p className="eyebrow">Your part in what comes next</p>
        <h2 tabIndex={-1} ref={heading}>{exhibit.name}</h2><h3>{exhibitRole?.title ?? exhibit.title}</h3>
        {exhibitRole && <p>Your approach brought together: {exhibitRole.qualities.map((quality) => quality.replace(/^The /, '').toLowerCase()).join(', ')}. Your role reflects these choices—not a fixed personality or a score. When strengths tie, your final commitment leads.</p>}
        <p>You chose to act. Your story began with <em>{exhibit.challenge.toLowerCase()}</em> and grew through cooperation.</p>
        <ol>{exhibit.choices.map((choice, i) => <li key={i}>{choice}</li>)}</ol>
        <aside className="future-consequence"><strong>One small step beyond this museum</strong><p>{exhibit.action}</p></aside>
        <p className="future-save-status">{saved ? 'Your exhibit is saved in this browser. Return whenever you like.' : 'Your exhibit is visible here, but browser storage is unavailable.'}</p>
        <div className="future-story__actions"><button className="future-button" onClick={() => { setStory(null); setFinished(false) }}>Write another chapter</button><Link to="/">Return to the hall →</Link></div>
      </motion.div>}
    </section>
  )
}
