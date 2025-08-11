import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAlertSettingStore } from "../../../../stores/alertSettingStore";
import { ArrowLeftIcon, ArrowRightIcon } from "../../../../assets";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const SpecificDateSelector = () => {
    const { specificDate, setSpecificDate } = useAlertSettingStore();

    useEffect(() => {
        if (!specificDate) {
            const today = dayjs().format("YYYY-MM-DD");
            setSpecificDate(today);
        }
    }, [specificDate, setSpecificDate]);

    const today = dayjs();
    const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));

    const startDay = currentMonth.startOf("week");
    const endDay = currentMonth.endOf("month").endOf("week");

    const dateList: dayjs.Dayjs[] = [];
    let date = startDay;

    while (date.isSame(endDay, "day") || date.isBefore(endDay, "day")) {
        dateList.push(date);
        date = date.add(1, "day");
    }

    const isSameDay = (a: dayjs.Dayjs, b: string | null) => {
        return b !== null && a.format("YYYY-MM-DD") === b;
    };

    const handleDateClick = (date: dayjs.Dayjs) => {
        const dateStr = date.format("YYYY-MM-DD");
        setSpecificDate(specificDate === dateStr ? null : dateStr); // toggle
    };

    return (
        <div className="flex flex-col items-start gap-2 self-stretch">
            <p className="flex h-[32px] flex-col justify-center self-stretch text-[#141414] font-pretendard text-[18px] font-semibold leading-none">날짜</p>
            <div className="flex flex-col items-start gap-2 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <button onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}>
                        <ArrowLeftIcon className="w-[18px] h-[18px]" />
                    </button>
                    <p className="text-[#4D4D4D] font-pretendard text-[16px] font-medium leading-none">{currentMonth.format("YYYY년 M월")}</p>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
                        <ArrowRightIcon className="w-[18px] h-[18px]" />
                    </button>
                </div>
                <div className="flex flex-col items-start self-stretch">
                    {/* 요일 헤더 */}
                    <div className="flex justify-between items-start self-stretch">
                        {weekdays.map((day) => (
                            <div key={day} className="flex w-[38px] h-[38px] flex-col justify-center items-center text-[#B8B8B8] font-pretendard text-[15px] font-medium leading-none">
                                {day}
                            </div>
                        ))}
                    </div>
                    {/* 날짜 리스트 */}
                    {Array.from({ length: Math.ceil(dateList.length / 7) }, (_, i) => dateList.slice(i * 7, i * 7 + 7)).map((week, idx) => (
                        <div key={idx} className="flex justify-between items-start self-stretch">
                            {week.map((d) => {
                                const isCurrentMonth = d.month() === currentMonth.month();
                                const selected = isSameDay(d, specificDate);

                                return (
                                    <button
                                    key={d.format("YYYY-MM-DD")} onClick={() => handleDateClick(d)} disabled={!isCurrentMonth}
                                    className={`rounded-lg flex w-[38px] h-[38px] flex-col justify-center items-center font-pretendard text-[15px] font-medium leading-none
                                    ${!isCurrentMonth ? "text-[#B8B8B8]" : selected ? "bg-[#5736FF] text-white" : "text-[#141414] hover:bg-[#F0F0F0]"}`}>
                                        {d.date()}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecificDateSelector;
