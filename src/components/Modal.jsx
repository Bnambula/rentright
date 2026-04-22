import { useEffect } from 'react'

export default function Modal({ open, onClose, title, sub, size = '', children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size}`}>
        {(title || onClose) && (
          <div className="modal-header">
            <div>
              {title && <div className="modal-title">{title}</div>}
              {sub && <div className="modal-sub">{sub}</div>}
            </div>
            {onClose && (
              <button className="modal-close" onClick={onClose}>×</button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
