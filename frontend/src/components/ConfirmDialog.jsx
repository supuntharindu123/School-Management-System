import AlertModal from "./AlertModal";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  onCancel,
  onConfirm,
}) {
  return (
    <AlertModal
      open={!!open}
      onClose={onCancel}
      title={title || "Confirm"}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-cyan-100 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm ${busy ? "bg-cyan-300 text-white" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? `${confirmLabel}...` : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm text-neutral-800">{message}</p>
    </AlertModal>
  );
}
