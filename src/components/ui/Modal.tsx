import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  variant?: 'center' | 'drawer'
  className?: string
}

/** Native <dialog>: focus trapping, Escape and inert background come from the browser. */
export function Modal({ open, onClose, title, children, footer, variant = 'center', className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={cn('modal', `modal--${variant}`, className)}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        // Clicks on the ::backdrop target the dialog element itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open && (
        <div className="modal__panel">
          <header className="modal__header">
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
            <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </header>
          <div className="modal__body">{children}</div>
          {footer && <footer className="modal__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
