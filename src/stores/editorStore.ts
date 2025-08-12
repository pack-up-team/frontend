import { create } from "zustand";

export type PanelMode = "ADD_ITEM" | "EDIT_STEP" | "EDIT_ITEM" | "EDIT_TEXT";
export type Category = "업무" | "생활" | "여행";

interface Step { id: number; name: string; textIds: number[]; }
interface Item { id: number; name: string; cate: Category; }
interface TextBox { id: number; value: string; }

interface EditorState {
    steps: Step[];
    items: Item[];
    texts: TextBox[];

    mode: PanelMode;
    selectedStepId?: number;
    selectedItemId?: number;
    selectedTextId?: number;

    // actions
    setMode: (m: PanelMode) => void;
    selectStep: (id: number) => void;
    selectItem: (id: number) => void;
    selectText: (id: number) => void;

    renameStep: (id: number, name: string) => void;
    renameItem: (id: number, name: string) => void;
    setTextValue: (id: number, v: string) => void;

    addTextToStep: (stepId: number) => number;
    removeTextFromStep: (stepId: number, textId: number) => void;
    reorderTextInStep: (stepId: number, from: number, to: number) => void;
}

function nextIdFromState(s: EditorState): number {
    let maxId = 0;

    // step / textIds / items / texts 전체에서 최대값 찾기
    for (const st of s.steps) {
        if (st.id > maxId) maxId = st.id;
        for (const tid of st.textIds ?? []) {
            if (tid > maxId) maxId = tid;
        }
    }
    for (const it of s.items) if (it.id > maxId) maxId = it.id;
    for (const t of s.texts) if (t.id > maxId) maxId = t.id;

    return maxId + 1;
}

export const useEditorStore = create<EditorState>((set) => ({
    steps: [{ id: 1, name: "STEP1", textIds: [] }],
    items: [],
    texts: [],

    mode: "ADD_ITEM",

    setMode: (m) => set({ mode: m }),
    selectStep: (id) => set({ selectedStepId: id, mode: "EDIT_STEP" }),
    selectItem: (id) => set({ selectedItemId: id, mode: "EDIT_ITEM" }),
    selectText: (id) => set({ selectedTextId: id, mode: "EDIT_TEXT" }),

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
                    st.id === stepId ? { ...st, textIds: [...(st.textIds ?? []), id] } : st
                ),
            };
        });
        return createdId;
    },
    removeTextFromStep: (stepId, textId) =>
        set((s) => ({
            texts: s.texts.filter((t) => t.id !== textId),
            steps: s.steps.map((st) =>
                st.id === stepId
                    ? { ...st, textIds: st.textIds.filter((id) => id !== textId) }
                    : st
            ),
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
}));
