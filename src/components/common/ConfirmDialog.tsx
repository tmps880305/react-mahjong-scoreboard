import type { ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, children, confirmLabel, cancelLabel = "キャンセル", onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-neutral-900 p-8 text-white shadow-2xl">
        <h3 className="mb-6 text-center text-3xl font-bold">{title}</h3>
        {children && <div className="mb-7 text-lg">{children}</div>}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/15 py-4 text-lg font-medium text-white/70"
          >
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-lg bg-amber-500 py-4 text-lg font-bold text-black">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
