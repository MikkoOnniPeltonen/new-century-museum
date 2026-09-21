import { PressableLink } from '../components/ui/Pressable'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Not found')

  return (
    <section className="grid min-h-[60dvh] place-items-center text-center">
      <div className="grid justify-items-center gap-4">
        <p className="eyebrow">Gallery 404</p>
        <h1 className="text-5xl font-semibold">This gallery hasn’t been built yet</h1>
        <p className="max-w-md text-ink-soft">The page you’re looking for isn’t part of the collection.</p>
        <PressableLink to="/" variant="primary" burst>
          Back to the hall
        </PressableLink>
      </div>
    </section>
  )
}
