import { describe, expect, it } from 'vitest'
import { STORIES } from './stories'
import { discoverRole } from './roles'

describe('exhibit roles', () => {
  it('gives each first-option journey a different, relevant role', () => {
    expect(STORIES.map((story) => discoverRole(story, story.chapters.map((chapter) => chapter.choices[0])).title)).toEqual([
      'The Community Gardener', 'The Fact Finder', 'The Welcoming Host', 'The Future Steward',
    ])
  })
  it('uses the final commitment on ties, but repeated strengths still lead', () => {
    const story = STORIES[0]
    expect(discoverRole(story, [story.chapters[0].choices[0], story.chapters[1].choices[0], story.chapters[2].choices[1]]).title).toBe('The Climate Advocate')
    expect(discoverRole(story, [story.chapters[0].choices[0], story.chapters[1].choices[1], story.chapters[2].choices[1]]).title).toBe('The Neighbourhood Ally')
  })
  it('offers multiple reachable roles for every story without randomness', () => {
    for (const story of STORIES) {
      const titles = new Set<string>()
      for (const first of story.chapters[0].choices) for (const second of story.chapters[1].choices) for (const third of story.chapters[2].choices) {
        const choices = [first, second, third]
        const result = discoverRole(story, choices)
        expect(result).toEqual(discoverRole(story, choices))
        expect(result.qualities).toContain(result.title)
        titles.add(result.title)
      }
      expect(titles.size).toBeGreaterThanOrEqual(4)
    }
  })
})
