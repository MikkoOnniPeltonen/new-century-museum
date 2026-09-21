import { Navigate, Outlet, useParams } from 'react-router'
import { isCentury } from '../../data/centuries'

/** Only the four known centuries reach the pages below; anything else goes back to the hall. */
export function CenturyGuard() {
  const { century } = useParams()
  if (!isCentury(century)) return <Navigate to="/" replace />
  return <Outlet />
}
