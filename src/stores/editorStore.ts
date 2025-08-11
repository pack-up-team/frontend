import { create } from "zustand";

export type PanelMode = "ADD_ITEM" | "EDIT_STEP" | "EDIT_ITEM" | "EDIT_TEXT";
export type Category = "업무" | "생활" | "여행";

interface Step { id: number; name: string; }
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
}

export const useEditorStore = create<EditorState>((set) => ({
    steps: [{ id: 1, name: "STEP1" }],
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
}));
