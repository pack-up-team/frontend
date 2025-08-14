import Modal from "./Modal";

export default function PreviewModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode; }) {
  return (
    <Modal open={open} onClose={onClose} title="미리보기" size="lg"
      actions={<button onClick={onClose} className="h-10 px-3 rounded-lg border">닫기</button>}
    >
      <div className="w-full flex justify-center">
        <div className="w-[800px] h-[800px] bg-white border rounded-xl overflow-hidden">
          {children /* 여기 안에 캔버스 스냅샷이나 readonly 뷰를 넣어도 됨 */}
        </div>
      </div>
    </Modal>
  );
}
