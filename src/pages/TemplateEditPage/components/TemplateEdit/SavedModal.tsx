import Modal from "./Modal";

export default function SavedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="저장 완료" size="sm"
      actions={<button onClick={onClose} className="h-10 px-3 rounded-lg border">확인</button>}
    >
      <p className="text-sm">템플릿이 저장되었습니다.</p>
    </Modal>
  );
}
