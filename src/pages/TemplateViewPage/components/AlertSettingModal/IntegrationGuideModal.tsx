import Button from "../../../../components/Button";
import { CloseIcon } from "../../../../assets";

type Channel = '슬랙' | '구글 캘린더';

interface IntegrationGuideModalProps {
    channel: Channel;
    onConfirm: () => void;
    onCancel: () => void;
}

const IntegrationGuideModal: React.FC<IntegrationGuideModalProps> = ({
    channel,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="flex w-[356px] px-[24px] pt-[16px] pb-[24px] flex-col justify-center items-center gap-8 rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
            <div className="flex flex-col items-center gap-4 self-stretch">
                <div className="flex h-[44px] justify-between items-center self-stretch">
                    <div className="w-11 h-11"></div>
                    <h2 className="text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal">안내</h2>
                    <div className="flex h-[44px] p-[10px_0_10px_20px] justify-end items-center">
                        <button onClick={onCancel} className="cursor-pointer w-6 h-6"><CloseIcon className="w-6 h-6" /></button>
                    </div>
                </div>
                <p className="text-[#4D4D4D] text-center font-pretendard text-[16px] font-medium leading-[140%]">
                    {channel === '슬랙' ? '슬랙 계정 연동이 필요합니다' : `${channel} 연동이 필요합니다`}
                </p>
            </div>
            <div className="flex flex-col items-start gap-8 self-stretch">
                <div className="flex items-center gap-4 self-stretch">
                    <Button onClick={onCancel} variant="line" className="flex-1 basis-0 h-[50px]">취소</Button>
                    <Button onClick={onConfirm} className="flex-1 basis-0 h-[50px]">연동하기</Button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationGuideModal;
