import { create } from 'zustand';

type Meridiem = '오전' | '오후';
type Channel = '슬랙' | '구글 캘린더';

type Time = {
    hour: number;
    minute: number;
    meridiem: Meridiem;
};

interface AlertSettingState {
    // 시간 선택
    selectedTime: Time;
    setSelectedTime: (time: Time) => void;

    // 반복 요일 선택
    repeatDays: string[];
    toggleRepeatDay: (day: string) => void;

    // 반복 토글 상태
    repeatEnabled: boolean;
    setRepeatEnabled: (enabled: boolean) => void;

    // 특정 날짜 선택
    specificDate: string | null; // 'YYYY-MM-DD'
    setSpecificDate: (date: string | null) => void;

    // 메모 입력
    memo: string;
    setMemo: (memo: string) => void;

    // 알림 채널
    selectedChannels: Channel[];
    setSelectedChannels: (updater: (prev: Channel[]) => Channel[]) => void;

    // 시간 선택 모달 열림 여부
    showTimeSelect: boolean;
    setShowTimeSelect: (show: boolean) => void;

    // 채널 선택 모달 열림 여부
    showChannelSelect: boolean;
    setShowChannelSelect: (show: boolean) => void;

    templateNo: number;
    setTemplateNo: (no: number) => void;

    userId: string;
    setUserId: (id: string) => void;

    // 서버 전송용 payload
    getPayload: () => {
        templateNo: number;
        userId: string;
        time: string;
        repeatDays?: string[];
        specificDate?: string;
        memo: string;
        channels: Channel[];
    };
}

export const useAlertSettingStore = create<AlertSettingState>((set, get) => ({
    selectedTime: {
        hour: 0,
        minute: 0,
        meridiem: '오전',
    },
    setSelectedTime: (time) => set({ selectedTime: time }),

    repeatDays: [],
    toggleRepeatDay: (day) => {
        const { repeatDays } = get();
        set({
            repeatDays: repeatDays.includes(day)
                ? repeatDays.filter((d) => d !== day)
                : [...repeatDays, day],
        });
    },

    repeatEnabled: false,
    setRepeatEnabled: (enabled) => set({ repeatEnabled: enabled }),

    specificDate: null,
    setSpecificDate: (date) => set({ specificDate: date }),

    memo: '',
    setMemo: (memo) => set({ memo }),

    selectedChannels: [],
    setSelectedChannels: (updater) => {
        set((state) => ({
            selectedChannels: updater(state.selectedChannels),
        }));
    },

    showTimeSelect: false,
    setShowTimeSelect: (show) => set({ showTimeSelect: show }),

    showChannelSelect: false,
    setShowChannelSelect: (show) => set({ showChannelSelect: show }),

    templateNo: 0,
    setTemplateNo: (no) => set({ templateNo: no }),

    userId: '',
    setUserId: (id) => set({ userId: id }),

    getPayload: () => {
        const { selectedTime, repeatDays, specificDate, memo, selectedChannels, repeatEnabled, templateNo, userId } = get();
        const timeStr = `${selectedTime.meridiem} ${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, '0')}`;

        const payload: {
            templateNo: number;
            userId: string;
            time: string;
            memo: string;
            channels: Channel[];
            repeatDays?: string[];
            specificDate?: string;
        } = {
            templateNo,
            userId,
            time: timeStr,
            memo,
            channels: selectedChannels,
        };

        if (repeatEnabled && repeatDays.length > 0) {
            payload.repeatDays = repeatDays;
        } else {
            payload.specificDate = specificDate || '';
        }

        return payload;
    },
}));
