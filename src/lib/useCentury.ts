import { useParams } from 'react-router'
import { isCentury, type Century } from '../data/centuries'

/** For pages rendered below <CenturyGuard>, which has already validated the param. */
export function useCentury(): Century {
  const { century } = useParams()
  if (!isCentury(century)) throw new Error('useCentury must be used below <CenturyGuard>')
  return century
}
