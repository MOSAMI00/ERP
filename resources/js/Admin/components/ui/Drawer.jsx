import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  header,
  footer,
  children,
  overlayClassName = 'fixed inset-0 bg-black/50 transition-opacity',
  panelClassName = 'fixed top-0 bottom-0 right-0 w-screen max-w-[640px] bg-brand-card shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col',
  bodyClassName = 'flex-1 min-h-0 overflow-y-auto',
  closeButtonClassName = 'p-2 text-brand-text-muted hover:text-brand-danger rounded-full hover:bg-brand-danger/10 transition-colors',
}) {
  const [mounted, setMounted] = useState(false);
  const portalTarget = useMemo(() => (typeof document !== 'undefined' ? document.body : null), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const drawer = (
    <>
      {isOpen && (
        <div className={overlayClassName} style={{ zIndex: 900 }} onClick={onClose} />
      )}
      <div
        className={`${panelClassName} ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
        style={{ zIndex: 910 }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {header || (
          <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-content/50">
            <h2 className="text-xl font-bold text-brand-text-primary">{title}</h2>
            <button onClick={onClose} className={closeButtonClassName}>
              <X size={24} />
            </button>
          </div>
        )}
        <div className={bodyClassName}>
          {children}
        </div>
        {footer && <div className="shrink-0">{footer}</div>}
      </div>
    </>
  );

  if (!mounted || !portalTarget) {
    return drawer;
  }

  return createPortal(drawer, portalTarget);
}
