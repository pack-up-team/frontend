import { useAlertSettingStore } from "../../../../stores/alertSettingStore";

const AlertMemoInput = () => {
    const { memo, setMemo } = useAlertSettingStore();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 50) {
            setMemo(e.target.value);
        }
    };

    return (
        <div className="flex flex-col items-start gap-2 self-stretch">
            <span className="flex h-[32px] items-center self-stretch text-[#141414] font-pretendard text-[18px] font-semibold leading-none">알림 메시지</span>
            <textarea className="resize-none flex h-[80px] p-[16px] items-start gap-2 self-stretch rounded-lg border border-[#CCC]
            placeholder-[#949494] placeholder-pretendard placeholder-text-[16px] placeholder-font-medium placeholder-leading-none"
            placeholder="알림 시 표시될 내용을 작성하세요 (선택)" value={memo} maxLength={50} onChange={handleChange}></textarea>
            <p className="flex justify-end items-center self-stretch
            text-[#949494] text-right font-pretendard text-[16px] font-medium leading-none">{memo.length}/50</p>
        </div>
    );
};

export default AlertMemoInput;
