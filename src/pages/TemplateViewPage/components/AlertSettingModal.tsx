import { useParams } from 'react-router-dom';
import { useAlertSettingStore } from "../../../stores/alertSettingStore";
import SpecificDateSelector from "./AlertSettingModal/SpecificDateSelector";
import TimeSelectModal from "./AlertSettingModal/TimeSelectModal";
import RepeatDayOption from "./AlertSettingModal/RepeatDayOption";
import ChannelSelectModal from "./AlertSettingModal/ChannelSelectModal";
import AlertMemoInput from "./AlertSettingModal/AlertMemoInput";
import { CloseIcon, ModalOpenIcon } from "../../../assets";
import Button from "../../../components/Button";

const AlertSettingModal = ({ onClose, onSave }: { onClose: () => void; onSave: () => void }) => {
    const { id: templateNo } = useParams();

    const {
        selectedTime,
        selectedChannels,
        setShowTimeSelect,
        setShowChannelSelect,
        showTimeSelect,
        showChannelSelect,
        getPayload,
    } = useAlertSettingStore();

    const isTimeSet = selectedTime.hour !== 0 || selectedTime.minute !== 0;

    const formattedTime = isTimeSet
        ? `${selectedTime.meridiem} ${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, "0")}`
        : "없음";
    
    const formattedChannels = selectedChannels.length > 0 ? selectedChannels.join(", ") : "없음";

    if (showTimeSelect) return <TimeSelectModal />;
    if (showChannelSelect) return <ChannelSelectModal />;

    const handleSave = () => {
        const payload = {
            ...getPayload(),
            templateNo: Number(templateNo),
            token: localStorage.getItem('token') || '',
        };
        console.log(payload);
        // TODO: 알림설정 API 연결
        onSave();
        onClose(); // 모달 닫기
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="flex w-[464px] px-[24px] pt-[16px] pb-[24px] flex-col justify-center items-center gap-4 rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
                <div className="flex h-[44px] justify-between items-center self-stretch">
                    <div className="w-11 h-11"></div>
                    <h2 className="text-[#141414] text-center font-pretendard text-[20px] font-semibold leading-normal">알림설정</h2>
                    <div className="flex h-[44px] p-[10px_0_10px_20px] justify-end items-center">
                        <button onClick={onClose} className="cursor-pointer w-6 h-6"><CloseIcon className="w-6 h-6" /></button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-8 self-stretch">
                    <div className="flex flex-col items-start gap-4 self-stretch">
                        <SpecificDateSelector />
                        <div className="flex h-[32px] justify-between items-center self-stretch">
                            <span className="text-[#141414] font-pretendard text-[18px] font-semibold leading-none">시간</span>
                            <div onClick={() => setShowTimeSelect(true)} className="cursor-pointer flex items-center gap-2">
                                <span className={`font-pretendard text-[16px] font-medium leading-none ${formattedTime === "없음" ? "text-[#949494]" : "text-[#5736FF]"}`}>
                                    {formattedTime}
                                </span>
                                <ModalOpenIcon className="w-[18px] h-[18px]" />
                            </div>
                        </div>
                        <RepeatDayOption />
                        <div className="flex h-[32px] justify-between items-center self-stretch">
                            <span className="text-[#141414] font-pretendard text-[18px] font-semibold leading-none">알림채널</span>
                            <div onClick={() => setShowChannelSelect(true)} className="cursor-pointer flex items-center gap-2">
                                <span className={`font-pretendard text-[16px] font-medium leading-none ${formattedChannels === "없음" ? "text-[#949494]" : "text-[#5736FF]"}`}>
                                    {formattedChannels}
                                </span>
                                <ModalOpenIcon className="w-[18px] h-[18px]" />
                            </div>
                        </div>
                        <AlertMemoInput />
                    </div>
                    <div className="flex flex-col items-start gap-8 self-stretch">
                        <div className="flex items-center gap-4 self-stretch">
                            <Button onClick={onClose} variant="line" className="flex-1 basis-0 h-[50px]">삭제</Button>
                            <Button disabled={!isTimeSet} onClick={handleSave} className="flex-1 basis-0 h-[50px]">저장</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertSettingModal;
