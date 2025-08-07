import { useState } from "react";
import { useAlertSettingStore } from "../../../../stores/alertSettingStore";
import Button from "../../../../components/Button";
import { ViewToggleOffIcon, ViewToggleOnIcon } from "../../../../assets";

type Channel = "슬랙" | "구글 캘린더";

const channelInfos: {
    name: Channel;
    description: string;
}[] = [
    {
        name: "슬랙",
        description: "슬랙으로 템플릿 알림을 받습니다",
    },
    {
        name: "구글 캘린더",
        description: "구글 캘린더로 템플릿 알림을 받습니다",
    },
];

const ChannelSelectModal = () => {
    const {
        selectedChannels,
        setSelectedChannels,
        setShowChannelSelect,
    } = useAlertSettingStore();

    const [tempChannels, setTempChannels] = useState<Channel[]>(selectedChannels);

    const toggleChannel = (channel: Channel) => {
        setTempChannels((prev) =>
            prev.includes(channel)
                ? prev.filter((c) => c !== channel)
                : [...prev, channel]
        );
        // TODO: 클릭된 채널이 연동 상태인지 확인하는 API 연동 필요
    };

    const handleComplete = () => {
        setSelectedChannels(() => tempChannels);
        setShowChannelSelect(false);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50" onClick={() => setShowChannelSelect(false)}>
            <div onClick={(e) => e.stopPropagation()} className="flex w-[464px] px-[24px] pt-[16px] pb-[24px] flex-col justify-center items-center gap-[16px] rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
                <div className="flex h-[44px] justify-center items-center self-stretch">
                    <h3 className="text-[#141414] text-center font-pretendard text-[20px] font-semibold leading-none">알림채널 선택</h3>
                </div>
                <div className="flex flex-col items-start gap-8 self-stretch">
                    <div className="flex flex-col items-start gap-6 self-stretch">
                        {channelInfos.map(({ name, description }) => (
                            <div key={name} className="flex flex-col items-start gap-1 self-stretch">
                                <div className="flex h-[32px] justify-between items-center self-stretch">
                                    <span className="text-[#141414] font-pretendard text-[18px] font-semibold leading-none">{name}</span>
                                    <button onClick={() => toggleChannel(name)}>
                                        {tempChannels.includes(name) ? (
                                            <ViewToggleOnIcon className="w-14 h-8" />
                                        ) : (
                                            <ViewToggleOffIcon className="w-14 h-8" />
                                        )}
                                    </button>
                                </div>
                                <p className="self-stretch text-[#949494] font-pretendard text-[16px] font-medium leading-none">{description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start gap-8 self-stretch">
                        <Button onClick={handleComplete} variant="line" className="!max-w-none !w-[416px] !h-[50px]">완료</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelSelectModal;
