import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../lib/cn'
import { useEffects, type ToastTone } from '../../store/effects'

const ICONS: Record<ToastTone, string> = { success: '✓', info: 'i', error: '!' }

export function ToastViewport() {
  const toasts = useEffects((state) => state.toasts)
  const dismiss = useEffects((state) => state.dismissToast)

  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            className={cn('toast', `toast--${toast.tone}`)}
            initial={{ opacity: 0, y: 28, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <span className="toast__icon" aria-hidden="true">
              {ICONS[toast.tone]}
            </span>
            <span>{toast.message}</span>
            <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
