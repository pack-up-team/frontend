import { create } from 'zustand';

// 대시보드용 템플릿 리스트 타입
export type TemplateListItem = {
    templateNo: number;
    templateNm: string;         // 템플릿 이름
    categoryNm?: string;        // 카테고리 이름
    regDt: string;              // 생성일(정렬 기준)
    updDt: string;              // 수정일(정렬 기준)
    thumbnail?: string;         // 썸네일 URL
    isBookmarked?: boolean;     // 북마크 여부
    alarmDt?: string;           // 알림 시간(정렬 기준)
    placeholder?: boolean;
};

type TemplateListStore = {
    templates: TemplateListItem[];
    setTemplates: (data: TemplateListItem[]) => void;
    clearTemplates: () => void;
};

export const useTemplateListStore = create<TemplateListStore>((set) => ({
    templates: [],
    setTemplates: (data) => set({ templates: data }),
    clearTemplates: () => set({ templates: [] }),
}));
