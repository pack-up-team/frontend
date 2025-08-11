import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../../components/Button";
import { CloseIcon } from "../../../assets";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (setId: string) => void;
};

const ensureRoot = () => {
    if (typeof document === "undefined") return null;
    let el = document.getElementById("modal-root");
    if (!el) {
        el = document.createElement("div");
        el.id = "modal-root";
        document.body.appendChild(el);
    }
    return el;
};

// 더미 데이터 (탭 3개)
const PRESETS = {
    office: [
        { id: "office-1", title: "회의 준비", desc: "필요 문서/장비를 빠짐없이 점검해요" },
        { id: "office-2", title: "업무 점검", desc: "오늘 해야할 체크리스트를 한 번에" },
        { id: "office-3", title: "출근 준비", desc: "바쁜 아침에도 빠짐 없는 준비" },
    ],
    daily: [
        { id: "daily-1", title: "장보기", desc: "카테고리별 장보기 추천 묶음" },
        { id: "daily-2", title: "이사 준비", desc: "체크 항목이 많은 이사 체크리스트" },
        { id: "daily-3", title: "반려동물", desc: "산책/미용/병원 방문 미리 체크" },
    ],
    travel: [
        { id: "travel-1", title: "여행 준비", desc: "바로 캐리어들고 떠날 수 있는 \n완벽한 체크리스트" },
        { id: "travel-2", title: "해외여행", desc: "여권/환전/USIM 등 필수 준비" },
        { id: "travel-3", title: "캠핑", desc: "캠핑/백패킹 필수 장비 묶음" },
    ],
} as const;

type TabKey = keyof typeof PRESETS;

export default function PresetSetModal({ isOpen, onClose, onConfirm }: Props) {
    const root = ensureRoot();
    const [tab, setTab] = useState<TabKey>("office");
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose]);

    // 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            setTab("office");
            setSelected(PRESETS["office"][0].id);
        }
    }, [isOpen]);

    const list = PRESETS[tab];
    const canConfirm = !!selected;

    if (!isOpen || !root) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
            {/* dim */}
            <button aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/50" />
            {/* 모달 카드 */}
            <div
                role="dialog"
                aria-modal="true"
                className="z-[9999] inline-flex flex-col gap-8 rounded-[12px] bg-white p-[16px_24px_24px_24px] shadow-[0_0_16px_0_rgba(0,0,0,0.02)]"
            >
                {/* contents */}
                <div className="flex flex-col items-center gap-4 self-stretch">
                    {/* header */}
                    <div className="flex h-11 items-center justify-between self-stretch">
                        <div className="h-11 w-11" />
                        <h2 className="font-pretendard text-[18px] font-semibold leading-normal text-[#141414]">
                            추천 템플릿 세트를 선택하세요.
                        </h2>
                        <div className="flex h-[44px] items-center justify-end p-[10px_0_10px_20px]">
                            <button onClick={onClose} className="h-6 w-6 cursor-pointer">
                                <CloseIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                    {/* 카테고리 탭 */}
                    <div className="flex w-[343px] items-center gap-4">
                        {([
                            { k: "office", label: "업무" },
                            { k: "daily", label: "생활" },
                            { k: "travel", label: "여행" },
                        ] as { k: TabKey; label: string }[]).map(({ k, label }) => {
                            const active = tab === k;
                            return (
                                <Button
                                    key={k}
                                    aria-selected={active}
                                    onClick={() => {
                                        setTab(k);
                                        setSelected(PRESETS[k]?.[0]?.id ?? null);
                                    }}
                                    variant={active ? "fill" : "line"}
                                    className={`h-[38px] p-0 text-[16px] font-pretendard ${
                                        active ? "bg-[#5736FF]" : ""
                                    }`}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>
                    {/* 템플릿 */}
                    <div className="grid grid-cols-3 gap-4">
                        {list.map((card) => {
                            const active = selected === card.id;
                            return (
                                <button
                                    key={card.id}
                                    onClick={() => setSelected(card.id)}
                                    className={`flex flex-col items-start gap-2 p-[16px] pr-[16px] pb-[32px] pl-[16px] rounded-[16px] border-2 bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)] ${
                                    active
                                        ? "border-[#A593FF]"
                                        : "border-[#F0F0F0]"
                                    }`}
                                >
                                    <div className="w-[240px] h-[240px] rounded-[16px] bg-[rgba(0,0,0,0.20)]" />
                                    <div className="flex flex-col items-start self-stretch text-left">
                                        <div className="flex w-[240px] h-[38px] items-center gap-2 text-[rgba(0,0,0,0.90)] font-pretendard text-[18px] font-semibold leading-none">{card.title}</div>
                                        <div className="whitespace-pre-line self-stretch text-[rgba(0,0,0,0.64)] font-pretendard text-[16px] font-medium leading-none">{card.desc}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                {/* actions */}
                <div className="flex justify-center items-center gap-4 self-stretch">
                    <Button onClick={onClose} className="w-[200px] h-[50px]" variant="line">닫기</Button>
                    <Button disabled={!canConfirm} onClick={() => selected && onConfirm(selected)} className="w-[200px] h-[50px]">선택</Button>
                </div>
            </div>
        </div>,
        root
    );
}
