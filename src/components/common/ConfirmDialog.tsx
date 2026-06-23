import type { ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  size?: "default" | "large";
  /** "danger": confirm button uses the plain outline style and sits on the left, cancel button is yellow and on the right. */
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  cancelLabel = "キャンセル",
  size = "default",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isLarge = size === "large";
  const isDanger = variant === "danger";
  const buttonSize = isLarge ? "py-3 text-lg" : "py-2 text-sm";

  const cancelButton = (
    <button
      key="cancel"
      onClick={onCancel}
      className={`flex-1 rounded-lg font-medium ${buttonSize} ${
        isDanger ? "bg-yellow-400 text-black" : "border border-white/15 text-white/70"
      }`}
    >
      {cancelLabel}
    </button>
  );
  const confirmButton = (
    <button
      key="confirm"
      onClick={onConfirm}
      className={`flex-1 rounded-lg ${buttonSize} ${
        isDanger ? "border border-white/15 font-medium text-white/70" : "bg-amber-500 font-bold text-black"
      }`}
    >
      {confirmLabel}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6">
      <div className={`w-full rounded-2xl bg-neutral-900 text-white shadow-2xl ${isLarge ? "max-w-3xl p-12" : "max-w-lg p-8"}`}>
        <h3 className={`text-center font-bold ${isLarge ? "mb-9 text-[2.8125rem]" : "mb-6 text-3xl"}`}>{title}</h3>
        {children && <div className={isLarge ? "mb-[2.625rem] text-[1.6875rem]" : "mb-7 text-lg"}>{children}</div>}
        <div className={`flex ${isLarge ? "gap-[1.125rem]" : "gap-3"}`}>
          {isDanger ? [confirmButton, cancelButton] : [cancelButton, confirmButton]}
        </div>
      </div>
    </div>
  );
}
