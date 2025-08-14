import { create } from "zustand";

export type PanelMode = "ADD_ITEM" | "EDIT_STEP" | "EDIT_ITEM" | "EDIT_TEXT";
export type Category = "office" | "daily" | "trip";

export type BackgroundKey =
    | "office-1" | "office-2" | "office-3" | "office-4"
    | "daily-1"  | "daily-2"  | "daily-3"  | "daily-4"
    | "trip-1"   | "trip-2"   | "trip-3"   | "trip-4";

interface Step {
    id: number;
    name: string;
    itemIds: number[];
    textIds: number[];
    // 캔버스 배치
    itemSlotById?: Record<number, number | undefined>;
    textSlotById?: Record<number, number | undefined>;
}
interface Item { id: number; name: string; cate: Category; catalogId?: number; }
interface TextBox { id: number; value: string; }

interface EditorStoreState {
    steps: Step[];
    items: Item[];
    texts: TextBox[];

    background: BackgroundKey; // 현재 배경

    mode: PanelMode;
    selectedStepId?: number;
    selectedItemId?: number;
    selectedTextId?: number;

    // actions
    setMode: (m: PanelMode) => void;
    selectStep: (id: number) => void;
    selectItem: (id: number) => void;
    selectText: (id: number) => void;
    clearSelection: () => void;

    setBackground: (cat: Category, stepsCount: 1 | 2 | 3 | 4) => void;
    setStepCount: (stepsCount: 1 | 2 | 3 | 4) => void;

    renameStep: (id: number, name: string) => void;
    renameItem: (id: number, name: string) => void;
    setTextValue: (id: number, v: string) => void;

    addTextToStep: (stepId: number) => number;
    removeTextFromStep: (stepId: number, textId: number) => void;
    reorderTextInStep: (stepId: number, from: number, to: number) => void;

    addItemToStep: (stepId: number, payload: { catalogId: number; name: string; cate: Category }) => number;

    // 캔버스 드래그-스냅 결과
    placeItem: (stepId: number, itemId: number, slotIndex: number) => void;
    placeText: (stepId: number, textId: number, slotIndex: number) => void;

    moveItemAcrossSteps: (itemId: number, fromStepId: number, toStepId: number) => void;
}

function nextIdFromState(s: EditorStoreState): number {
    let maxId = 0;

    for (const st of s.steps) {
        if (st.id > maxId) maxId = st.id;
        for (const tid of st.textIds) if (tid > maxId) maxId = tid;
        for (const iid of st.itemIds) if (iid > maxId) maxId = iid;
    }
    for (const it of s.items) if (it.id > maxId) maxId = it.id;
    for (const t of s.texts) if (t.id > maxId) maxId = t.id;

    return maxId + 1;
}

function ensureMaps(st: Step): Step {
    return {
        ...st,
        itemSlotById: st.itemSlotById ?? {},
        textSlotById: st.textSlotById ?? {},
    };
}

function makeBg(cat: Category, steps: 1 | 2 | 3 | 4): BackgroundKey {
    return `${cat}-${steps}` as BackgroundKey;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
    steps: [
        { id: 1, name: "STEP1", itemIds: [], textIds: [], itemSlotById: {}, textSlotById: {} },
    ],
    items: [],
    texts: [],

    background: makeBg("office", 3),

    mode: "ADD_ITEM",

    setMode: (m) => set({ mode: m }),
    selectStep: (id) => set({ selectedStepId: id, mode: "EDIT_STEP" }),
    selectItem: (id) => set({ selectedItemId: id, mode: "EDIT_ITEM" }),
    selectText: (id) => set({ selectedTextId: id, mode: "EDIT_TEXT" }),
    clearSelection: () =>
        set({
            selectedStepId: undefined,
            selectedItemId: undefined,
            selectedTextId: undefined,
            mode: "ADD_ITEM",
        }),

    setBackground: (cat, stepsCount) => {
        // 배경키 갱신
        set({ background: makeBg(cat, stepsCount) });
        // 스텝 수도 함께 맞추고, 배치 맵은 초기화
        get().setStepCount(stepsCount);
    },

    setStepCount: (stepsCount) => {
        set((s) => {
            const steps = s.steps
                .slice(0, stepsCount)
                .map((st) => {
                    const safe = ensureMaps(st);
                    return {
                        ...safe,
                        // 레이아웃이 달라질 수 있으므로 배치 맵 초기화
                        itemSlotById: {},
                        textSlotById: {},
                    };
                });
    
            while (steps.length < stepsCount) {
                const newId = nextIdFromState({ ...s, steps });
                steps.push({
                    id: newId,
                    name: `STEP${steps.length + 1}`,
                    itemIds: [],
                    textIds: [],
                    itemSlotById: {},
                    textSlotById: {},
                });
            }
    
            return { steps };
        });
    },

    renameStep: (id, name) =>
        set((s) => ({
            steps: s.steps.map((st) => (st.id === id ? { ...st, name } : st)),
        })),
    renameItem: (id, name) =>
        set((s) => ({
            items: s.items.map((it) => (it.id === id ? { ...it, name } : it)),
        })),
    setTextValue: (id, v) =>
        set((s) => ({
            texts: s.texts.map((tx) => (tx.id === id ? { ...tx, value: v } : tx)),
        })),
    addTextToStep: (stepId) => {
        let createdId = 0;
        set((s) => {
            const id = nextIdFromState(s);
            createdId = id;
            return {
                texts: [...s.texts, { id, value: "" }],
                steps: s.steps.map((st) =>
                    st.id === stepId
                        ? {
                                ...ensureMaps(st),
                                textIds: [...st.textIds, id],
                                // 슬롯 자동할당은 캔버스에서 placeText로 처리
                            }
                        : st
                ),
            };
        });
        return createdId;
    },
    removeTextFromStep: (stepId, textId) =>
        set((s) => ({
            texts: s.texts.filter((t) => t.id !== textId),
            steps: s.steps.map((st) => {
                if (st.id !== stepId) return st;
                const safe = ensureMaps(st);
                const map = { ...(safe.textSlotById ?? {}) };
                delete map[textId];
                return { ...safe, textIds: safe.textIds.filter((id) => id !== textId), textSlotById: map };
            }),
            selectedTextId: s.selectedTextId === textId ? undefined : s.selectedTextId,
        })),
    reorderTextInStep: (stepId, from, to) =>
        set((s) => ({
            steps: s.steps.map((st) => {
                if (st.id !== stepId) return st;
                const arr = [...st.textIds];
                const [moved] = arr.splice(from, 1);
                arr.splice(to, 0, moved);
                return { ...st, textIds: arr };
            }),
        })),
    addItemToStep: (stepId, payload) => {
        let created = 0;
        set((s) => {
            const id = nextIdFromState(s);
            created = id;
            return {
                items: [...s.items, { id, name: payload.name, cate: payload.cate, catalogId: payload.catalogId }],
                steps: s.steps.map((st) =>
                    st.id === stepId
                        ? {
                                ...ensureMaps(st),
                                itemIds: [...st.itemIds, id],
                                // 슬롯 자동할당은 캔버스에서 placeItem으로 처리
                            }
                        : st
                ),
            };
        });
        return created;
    },
    placeItem: (stepId, itemId, slotIndex) =>
        set((s) => ({
            steps: s.steps.map((st) => {
                if (st.id !== stepId) return st;
                const safe = ensureMaps(st);
                return { ...safe, itemSlotById: { ...safe.itemSlotById, [itemId]: slotIndex } };
            }),
        })),
    placeText: (stepId, textId, slotIndex) =>
        set((s) => ({
            steps: s.steps.map((st) => {
                if (st.id !== stepId) return st;
                const safe = ensureMaps(st);
                return { ...safe, textSlotById: { ...safe.textSlotById, [textId]: slotIndex } };
            }),
        })),
    moveItemAcrossSteps: (itemId, fromStepId, toStepId) =>
        set((s) => {
            if (fromStepId === toStepId) return {};
            const steps = s.steps.map((st) => {
                if (st.id === fromStepId) {
                    // from 에서 리스트 & 슬롯 매핑 제거
                    const slots = { ...(st.itemSlotById ?? {}) };
                    delete slots[itemId];
                    return {
                        ...st,
                        itemIds: st.itemIds.filter((id) => id !== itemId),
                        itemSlotById: slots,
                    }
                }
                if (st.id === toStepId) {
                    // to 에 중복이 없다면 추가
                    return st.itemIds.includes(itemId)
                        ? st
                        : { ...st, itemIds: [...st.itemIds, itemId] };
                }
                return st;
            });
            return { steps };
        }),
}));

export type EditorState = ReturnType<typeof useEditorStore.getState>;
