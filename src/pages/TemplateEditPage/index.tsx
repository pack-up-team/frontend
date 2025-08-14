import { useLayoutEffect, useState } from "react";
import TemplateEdit from "./components/TemplateEdit/TemplateEdit";
import RightPanel from "./components/RightPanel/RightPanel";
import { useEditorStore } from "../../stores/editorStore";
import type { EditorState } from "../../stores/editorStore";
import HeaderBar from "./components/TemplateEdit/HeaderBar";
import StepSelectModal from "./components/TemplateEdit/StepSelectModal";
import BackgroundSelectModal from "./components/TemplateEdit/BackgroundSelectModal";
import PreviewModal from "./components/TemplateEdit/PreviewModal";
import SavedModal from "./components/TemplateEdit/SavedModal";

export default function TemplateEditPage() {
    const [ready, setReady] = useState(false);
    // 헤더/모달 제어
    const [openStep, setOpenStep] = useState(false);
    const [openBg, setOpenBg] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [openSaved, setOpenSaved] = useState(false);
    // 템플릿 제목(스토어가 없으면 로컬 관리)
    const [templateTitle, setTemplateTitle] = useState("");

    // 최초 진입 시 더미 데이터 주입
    // TODO: 서버에서 데이터 불러오기
    useLayoutEffect(() => {
        const st = useEditorStore.getState();
        const isEmpty =
            (st.items?.length ?? 0) === 0 &&
            (st.texts?.length ?? 0) === 0 &&
            (st.steps?.length ?? 0) > 0 &&
            st.steps.every(
                (s) =>
                (s.itemIds?.length ?? 0) === 0 &&
                (s.textIds?.length ?? 0) === 0
            );
        if (!isEmpty) {
            // 이미 데이터가 있으면 바로 렌더 허용
            setReady(true);
            return; // 사용자가 뭔가 넣어둔 상태면 덮어쓰지 않음
        }

        const demo: Partial<EditorState> = {
            background: "trip-3",
            steps: [
                {
                    id: 1, name: "STEP1",
                    itemIds: [101, 102, 103, 104],
                    textIds: [201],
                    itemSlotById: { 101: 0, 102: 1, 103: 4, 104: 8 }, // 모서리센터 예시
                    textSlotById: { 201: 0 },
                },
                {
                    id: 2, name: "STEP2",
                    itemIds: [105, 106, 107],
                    textIds: [202],
                    itemSlotById: { 105: 2, 106: 3, 107: 7 },
                    textSlotById: { 202: 1 },
                },
                {
                    id: 3, name: "STEP3",
                    itemIds: [108, 109, 110, 111],
                    textIds: [203],
                    itemSlotById: { 108: 0, 109: 5, 110: 12, 111: 16 },
                    textSlotById: { 203: 2 },
                },
            ],
            items: [
                { id: 101, name: "Passport",  cate: "trip", catalogId: 1 },
                { id: 102, name: "Airline_ticket",    cate: "trip", catalogId: 2 },
                { id: 103, name: "Bandage",    cate: "trip", catalogId: 3 },
                { id: 104, name: "Bluetooth_earphones",  cate: "trip", catalogId: 4 },
                { id: 105, name: "Charger",   cate: "trip", catalogId: 5 },
                { id: 106, name: "Laptop",   cate: "office", catalogId: 6 },
                { id: 107, name: "Headphones",       cate: "trip", catalogId: 7 },
                { id: 108, name: "Snack",    cate: "trip", catalogId: 8 },
                { id: 109, name: "Umbrella",  cate: "trip", catalogId: 9 },
                { id: 110, name: "Thermos",    cate: "trip", catalogId: 10 },
                { id: 111, name: "Eyepatch",  cate: "trip", catalogId: 11 },
            ],
            texts: [
                { id: 201, value: "여권/티켓은 맨 위!" },
                { id: 202, value: "충전기/노트북은 함께." },
                { id: 203, value: "우산은 바깥쪽 포켓." },
            ],
        };

        useEditorStore.setState((prev: EditorState) => ({ ...prev, ...demo }));
        // 시딩 완료 → 렌더 허용
        setReady(true);
    }, []);

    return (
        <div className="flex flex-col h-screen">
            {/* 상단 헤더 (144px 컨테이너 유지: 하단 캔버스 높이 계산과 일치) */}
            <div className="flex items-center px-4" style={{ height: 144 }}>
                <HeaderBar
                    title={templateTitle}
                    onChangeTitle={setTemplateTitle}
                    onOpenBackgroundModal={() => setOpenBg(true)}
                    onOpenStepModal={() => setOpenStep(true)}
                    onOpenPreview={() => setOpenPreview(true)}
                    onSave={() => setOpenSaved(true)}
                />
            </div>

            {/* 본문: 좌측 캔버스 + 우측 패널 */}
            <div className="flex flex-1 bg-[#E5E5E5] items-center justify-center min-h-0 gap-2 px-2 pb-2">
                {/* 캔버스 래퍼 */}
                {ready && (
                    <div className="bg-white mx-auto w-[800px] h-[800px] overflow-hidden">
                        <TemplateEdit />
                    </div>
                )}

                {/* 우측 패널 */}
                {ready && (
                    <aside
                        className="rounded-xl border border-[#eee] bg-white"
                        style={{ width: 432, minWidth: 420, height: "calc(100vh - 144px)" }}
                    >
                        <RightPanel />
                    </aside>
                )}
            </div>

            <StepSelectModal open={openStep} onClose={() => setOpenStep(false)} />
            <BackgroundSelectModal open={openBg} onClose={() => setOpenBg(false)} />

            <PreviewModal open={openPreview} onClose={() => setOpenPreview(false)}>
                {ready && (
                    // 모달 안에서 800×800으로 고정 프레임
                    <div className="relative w-[800px] h-[800px] overflow-hidden">
                        {/* 편집용 캔버스를 그대로 재사용하되 상호작용만 차단 */}
                        <div className="pointer-events-none">
                            <TemplateEdit />
                        </div>
                    </div>
                )}
            </PreviewModal>

            <SavedModal open={openSaved} onClose={() => setOpenSaved(false)} />

        </div>
    );
}
