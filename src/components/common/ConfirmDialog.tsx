import type { ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  size?: "default" | "large";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  cancelLabel = "キャンセル",
  size = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isLarge = size === "large";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6">
      <div className={`w-full rounded-2xl bg-neutral-900 text-white shadow-2xl ${isLarge ? "max-w-3xl p-12" : "max-w-lg p-8"}`}>
        <h3 className={`text-center font-bold ${isLarge ? "mb-9 text-[2.8125rem]" : "mb-6 text-3xl"}`}>{title}</h3>
        {children && <div className={isLarge ? "mb-[2.625rem] text-[1.6875rem]" : "mb-7 text-lg"}>{children}</div>}
        <div className={`flex ${isLarge ? "gap-[1.125rem]" : "gap-3"}`}>
          <button
            onClick={onCancel}
            className={`flex-1 rounded-lg border border-white/15 font-medium text-white/70 ${
              isLarge ? "py-6 text-[1.6875rem]" : "py-4 text-lg"
            }`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg bg-amber-500 font-bold text-black ${isLarge ? "py-6 text-[1.6875rem]" : "py-4 text-lg"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
