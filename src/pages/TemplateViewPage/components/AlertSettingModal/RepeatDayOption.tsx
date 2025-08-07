import { useAlertSettingStore } from "../../../../stores/alertSettingStore";
import { ViewToggleOffIcon, ViewToggleOnIcon, DividerIcon } from "../../../../assets";

const days = ["월", "화", "수", "목", "금", "토", "일"];

const baseButtonClass = "flex w-[38px] h-[38px] flex-col justify-center items-center rounded-lg font-pretendard text-[15px] font-medium leading-none";
const getButtonClass = (selected: boolean) => `${baseButtonClass} ${selected ? "bg-[#5736FF] text-white" : "bg-[#F0F0F0] text-[#141414]"}`;

const RepeatDayOption = () => {
    const repeatDays = useAlertSettingStore((state) => state.repeatDays);
    const toggleRepeatDay = useAlertSettingStore((state) => state.toggleRepeatDay);

    const repeatEnabled = useAlertSettingStore((state) => state.repeatEnabled);
    const setRepeatEnabled = useAlertSettingStore((state) => state.setRepeatEnabled);

    const selectAll = () => {
        if (repeatDays.length === 7) {
            days.forEach((day) => toggleRepeatDay(day)); // 전체 해제
        } else {
            days.forEach((day) => {
                if (!repeatDays.includes(day)) toggleRepeatDay(day); // 전체 선택
            });
        }
    };

    return (
        <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex h-[32px] justify-between items-center self-stretch">
                <span className="text-[#141414] font-pretendard text-[18px] font-semibold leading-normal">반복요일</span>
                <button onClick={() => setRepeatEnabled(!repeatEnabled)}>
                    {repeatEnabled ? <ViewToggleOnIcon className="w-14 h-8" /> : <ViewToggleOffIcon className="w-14 h-8" />}
                </button>
            </div>
            {repeatEnabled && (
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex pb-6 justify-center items-center gap-3 self-stretch">
                        <button onClick={selectAll} className={`${getButtonClass(repeatDays.length === 7)} !w-[56px]`}>매일</button>
                        <DividerIcon />
                        {days.map((day) => (
                            <button key={day} onClick={() => toggleRepeatDay(day)} className={getButtonClass(repeatDays.includes(day))}>{day}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepeatDayOption;
