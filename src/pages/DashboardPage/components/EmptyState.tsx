import { EmptyIcon } from "../../../assets";

const EmptyState = () => {
    return (
        <section className="flex flex-col items-center gap-[16px] p-[100px_0] flex-[1_0_0] self-stretch">
            <EmptyIcon className="w-[50px] h-[50px]" />
            <p className="text-[#707070] text-center font-pretendard text-[16px] font-medium leading-[140%]">
                저장된 템플릿이 없습니다
                <br />
                반복되는 할일을 쉽게 기억하는 나만의 템플릿을 만들어보세요
            </p>
        </section>
    );
};

export default EmptyState;
