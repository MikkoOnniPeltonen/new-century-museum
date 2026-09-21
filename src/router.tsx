import { createBrowserRouter } from 'react-router'
import { AppLayout, PageFallback } from './components/layout/AppLayout'
import { CenturyGuard } from './components/layout/CenturyGuard'
import { CollectPage } from './features/collect/CollectPage'
import { HallPage } from './features/hall/HallPage'
import { NotFoundPage } from './features/NotFoundPage'
import { RoomPage } from './features/room/RoomPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: AppLayout,
      HydrateFallback: PageFallback,
      children: [
        { index: true, Component: HallPage },
        {
          path: 'next-wing',
          lazy: async () => ({ Component: (await import('./features/next-wing/NextWingPage')).NextWingPage }),
        },
        {
          path: 'room/:century',
          Component: CenturyGuard,
          children: [
            { index: true, Component: RoomPage },
            { path: 'collect', Component: CollectPage },
            {
              path: 'game',
              lazy: async () => ({ Component: (await import('./features/game/GamePage')).GamePage }),
            },
          ],
        },
        {
          path: 'map/:century',
          Component: CenturyGuard,
          children: [
            {
              index: true,
              lazy: async () => ({ Component: (await import('./features/map/MapPage')).MapPage }),
            },
          ],
        },
        {
          path: 'timeline',
          lazy: async () => ({ Component: (await import('./features/timeline/TimelinePage')).TimelinePage }),
        },
        { path: '*', Component: NotFoundPage },
      ],
    },
  ],
  { basename },
)
