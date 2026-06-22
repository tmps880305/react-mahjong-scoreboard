import type { ReactNode } from "react";

interface OverlayProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Overlay({ title, onClose, children, footer }: OverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/70">
      <div className="mx-auto mt-auto flex h-[min(100vw,100dvh)] w-[min(100vw,100dvh)] flex-col rounded-t-2xl bg-neutral-900 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/60 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">{children}</div>
        {footer && <div className="border-t border-white/10 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">{footer}</div>}
      </div>
    </div>
  );
}
