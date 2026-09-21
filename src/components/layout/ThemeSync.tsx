import { useEffect } from 'react'
import { useActiveCentury } from '../../lib/useActiveCentury'
import { useTheme } from '../../store/theme'

/** Writes the current century to <html data-century>, which drives every themed CSS layer. */
export function ThemeSync() {
  const active = useActiveCentury()
  const preview = useTheme((state) => state.preview)
  const last = useTheme((state) => state.last)
  const setLast = useTheme((state) => state.setLast)

  useEffect(() => {
    if (active) setLast(active)
  }, [active, setLast])

  useEffect(() => {
    document.documentElement.dataset.century = preview ?? active ?? last
  }, [preview, active, last])

  return null
}
