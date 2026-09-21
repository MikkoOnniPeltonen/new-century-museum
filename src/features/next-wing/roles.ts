import type { Choice, Story } from './stories'

const roles: Record<string, Record<string, string>> = {
  climate: { 'The Connector': 'The Neighbourhood Ally', 'The Community Builder': 'The Community Gardener', 'The Bridge Builder': 'The Knowledge Sharer', 'The Listener': 'The Thoughtful Listener', 'The Practical Innovator': 'The Resourceful Maker', 'The Advocate': 'The Climate Advocate' },
  trust: { 'The Investigator': 'The Fact Finder', 'The Bridge Builder': 'The Clarity Maker', 'The Connector': 'The Trust Builder', 'The Community Builder': 'The Conversation Starter', 'The Listener': 'The Thoughtful Listener', 'The Advocate': 'The Accountability Champion' },
  belonging: { 'The Listener': 'The Space Holder', 'The Community Builder': 'The Welcoming Host', 'The Connector': 'The Neighbourhood Connector', 'The Bridge Builder': 'The Bridge Builder' },
  technology: { 'The Listener': 'The Human-Centred Designer', 'The Practical Innovator': 'The Thoughtful Inventor', 'The Investigator': 'The Resourceful Explorer', 'The Advocate': 'The Access Champion', 'The Bridge Builder': 'The Simplicity Maker', 'The Community Builder': 'The Future Steward' },
}

/** Repeated strengths lead; on a tie, the closing commitment defines the role. */
export function discoverRole(story: Story, choices: Choice[]) {
  const counts = new Map<string, number>()
  choices.forEach(({ strength }) => counts.set(strength, (counts.get(strength) ?? 0) + 1))
  const highest = Math.max(0, ...counts.values())
  const strength = [...choices].reverse().find((choice) => counts.get(choice.strength) === highest)?.strength
  const titles = roles[story.id] ?? {}
  return {
    title: strength ? titles[strength] ?? strength : 'The Changemaker',
    qualities: [...new Set(choices.map((choice) => titles[choice.strength] ?? choice.strength))],
  }
}
