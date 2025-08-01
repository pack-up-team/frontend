import { RenameIcon, EditIcon, DuplicateIcon, DeleteIcon } from "../../../assets";

type DropdownMenuProps = {
    onRename?: () => void;
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    onRename,
    onEdit,
    onDuplicate,
    onDelete,
}) => {
    return (
        <div className="inline-flex px-[16px] py-[12px] items-center rounded-[8px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
            <ul className="flex flex-col items-start gap-[12px]">
                <li onClick={onRename} className="cursor-pointer flex h-[36px] justify-center items-center gap-[8px]">
                    <RenameIcon className="w-[18px] h-[18px]" />
                    <p className="text-[rgba(0,0,0,0.7)] font-pretendard text-[16px] font-medium leading-normal">템플릿명 변경</p>
                </li>
                <li onClick={onEdit} className="cursor-pointer flex h-[36px] justify-center items-center gap-[8px]">
                    <EditIcon className="w-[18px] h-[18px]" />
                    <p className="text-[rgba(0,0,0,0.7)] font-pretendard text-[16px] font-medium leading-normal">편집하기</p>
                </li>
                <li onClick={onDuplicate} className="cursor-pointer flex h-[36px] justify-center items-center gap-[8px]">
                    <DuplicateIcon className="w-[18px] h-[18px]" />
                    <p className="text-[rgba(0,0,0,0.7)] font-pretendard text-[16px] font-medium leading-normal">복사하기</p>
                </li>
                <div className="h-0 self-stretch">
                    <svg xmlns="http://www.w3.org/2000/svg" width="114" height="2" viewBox="0 0 114 2" fill="none">
                        <path d="M0.882812 0.839844H113.883" stroke="#F0F0F0" strokeWidth="1" />
                    </svg>
                </div>
                <li onClick={onDelete} className="cursor-pointer flex h-[36px] justify-center items-center gap-[8px]">
                    <DeleteIcon className="w-[18px] h-[18px]" />
                    <p className="text-[rgba(0,0,0,0.7)] font-pretendard text-[16px] font-medium leading-normal">삭제하기</p>
                </li>
            </ul>
        </div>
    );
};

export default DropdownMenu;
