import { useEffect, useRef } from 'react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[3px] border-2 px-4 py-2 font-semibold leading-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'

const variants = {
  solid: 'border-ink bg-ink text-panel hover:bg-mark hover:text-ink',
  ghost: 'border-ink bg-transparent text-ink hover:bg-ink hover:text-panel',
  danger: 'border-danger bg-transparent text-danger hover:bg-danger hover:text-panel',
}

export function Button({ variant = 'solid', className = '', ...props }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

const fieldBox =
  'w-full rounded-[3px] border-2 border-ink/70 bg-panel px-3 py-2 text-ink placeholder:text-ink-soft/70 hover:border-ink focus:border-ink focus:bg-white'

export function Field({ label, hint, error, id, className = '', as = 'input', children, ...props }) {
  const Tag = as
  const fieldId = id || `f-${label?.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1 block text-[0.95rem] font-semibold">
        {label}
      </label>
      <Tag
        id={fieldId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || hint ? `${fieldId}-note` : undefined}
        className={`${fieldBox} ${as === 'textarea' ? 'min-h-32 resize-y' : ''} ${error ? 'border-danger' : ''}`}
        {...props}
      >
        {children}
      </Tag>
      {(error || hint) && (
        <p id={`${fieldId}-note`} className={`mt-1 text-sm ${error ? 'text-danger' : 'text-ink-soft'}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

/** Native <dialog>: focus trapping, Esc to close and a backdrop come for free. */
export function Dialog({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-md border-2 border-ink bg-panel p-0 text-ink`}
    >
      {open && (
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="-m-2 cursor-pointer p-2 text-2xl leading-none hover:bg-mark"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

/** Wraps matches of `query` in the highlighter mark. */
export function Highlight({ text, query }) {
  const q = (query || '').trim()
  if (!q || !text) return text || null
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="hl">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export function Pager({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <nav aria-label="Pages" className="mt-8 flex items-center gap-3">
      <Button variant="ghost" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-ink-soft">
        Page {page + 1} of {totalPages}
      </span>
      <Button variant="ghost" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </nav>
  )
}

export function Empty({ title, children }) {
  return (
    <div className="border-y-2 border-dashed border-rule py-14">
      <p className="text-xl font-bold">{title}</p>
      {children && <div className="mt-2 max-w-md text-ink-soft">{children}</div>}
    </div>
  )
}

export function Loading({ label = 'Loading' }) {
  return (
    <p role="status" className="py-14 text-ink-soft">
      {label}…
    </p>
  )
}

export function ErrorNote({ children, onRetry }) {
  return (
    <div role="alert" className="border-l-4 border-danger bg-panel py-3 pl-4 pr-3">
      <p className="font-semibold text-danger">{children}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-1 cursor-pointer font-semibold underline underline-offset-4 hover:bg-mark">
          Try again
        </button>
      )}
    </div>
  )
}
