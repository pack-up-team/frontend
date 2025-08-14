import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode; // 하단 버튼 영역
  size?: "sm" | "md" | "lg";
};

export default function Modal({ open, title, onClose, children, actions, size = "md" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const width = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] ${width}
                    bg-white rounded-2xl shadow-xl overflow-hidden`}
        role="dialog"
        aria-modal
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 -m-2 rounded hover:bg-black/5" aria-label="close">✕</button>
        </div>
        <div className="p-6">{children}</div>
        {actions && <div className="px-6 py-4 border-t flex justify-end gap-2">{actions}</div>}
      </div>
    </div>,
    document.body
  );
}
