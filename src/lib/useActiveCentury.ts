import { useMatches, useSearchParams } from 'react-router'
import { isCentury, type Century } from '../data/centuries'

/** The century in focus: from the route (/room/:century, /map/:century) or ?century= on the timeline. */
export function useActiveCentury(): Century | undefined {
  const matches = useMatches()
  const [searchParams] = useSearchParams()
  const fromRoute = matches.map((match) => match.params.century).find(isCentury)
  if (fromRoute) return fromRoute
  const fromQuery = searchParams.get('century')
  return isCentury(fromQuery) ? fromQuery : undefined
}
