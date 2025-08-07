import { create } from "zustand";

interface StepObject {
    cateNo: number;
    objNo: number;
    objNm: string;
    locNum: number;
}

interface StepText {
    text: string;
    stepTextX: number;
    stepTextY: number;
}

interface Step {
    step: number;
    stepX: number;
    stepY: number;
    stepObjList: StepObject[];
    stepTextList: StepText[];
}

interface TemplateData {
    templateNo: number;
    templateNm: string;
    templateCateNo: number; // 템플릿 카테고리 번호
    userNo: number;
    userId: string;
    imgFile: string;
    stepsList: Step[];

    alarmDt?: string | null;
    repeatType?: string | null;
    alarmRepeatDay?: string[] | null;
    alarmTime?: string | null;
}

interface TemplateDetailState {
    templateData: TemplateData | null;
    setTemplateData: (data: TemplateData) => void;
    clearTemplate: () => void;
}

export const useTemplateDetailStore = create<TemplateDetailState>((set) => ({
    templateData: null,

    setTemplateData: (data) => set({ templateData: data }),

    clearTemplate: () => set({ templateData: null }),
}));
