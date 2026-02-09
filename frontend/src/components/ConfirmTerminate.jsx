import AlertModal from "./AlertModal";
import Modal from "./modal";

export default function ConfirmSubjectTerminate({
  open,
  subject,
  className,
  onCancel,
  onConfirm,
  busy,
}) {
  return (
    <AlertModal
      open={open}
      onClose={onCancel}
      title={`Terminate ${subject ? "Subject" : "Class"} Assignment`}
      footer={
        <>
          <button
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-neutral-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm ${busy ? "bg-cyan-300 text-white" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Terminating..." : "Confirm"}
          </button>
        </>
      }
    >
      <p className="text-sm text-neutral-800">
        Are you sure you want to terminate the {subject ? "subject" : "class"}{" "}
        assignment
        {subject ? ` ${subject}` : ""}
        {className ? ` for ${className}` : ""}? This action cannot be undone.
      </p>
    </AlertModal>
  );
}
