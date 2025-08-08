// import { useTemplateDetailStore } from "../../../stores/templateDetailStore";

// 전체 보드: 6x6
// ox, oy: 서브그리드의 좌상단 원점(px)
const PARTITIONS_BY_TOTAL_STEPS: Record<
    number,
    Record<number, { ox: number; oy: number; cols: number; rows: number }>
> = {
    1: {
        1: { ox: 235, oy: 275, cols: 6, rows: 6 },
    },
    2: {
        1: { ox: 135, oy: 245, cols: 3, rows: 6 },
        2: { ox: 435, oy: 245, cols: 3, rows: 6 },
    },
    3: {
        1: { ox: 135, oy: 195, cols: 3, rows: 3 },
        2: { ox: 135, oy: 485, cols: 3, rows: 3 },
        3: { ox: 445, oy: 240, cols: 3, rows: 6 },
    },
    4: {
        1: { ox: 155, oy: 190, cols: 3, rows: 3 },
        2: { ox: 155, oy: 485, cols: 3, rows: 3 },
        3: { ox: 460, oy: 190, cols: 3, rows: 3 },
        4: { ox: 460, oy: 485, cols: 3, rows: 3 },
    },
};

// 서브그리드에서의 오브젝트 좌표 계산
const localCellFromLocNum = (locNum: number, cols: number) => {
    const sx = ((locNum - 1) % cols) + 1;
    const sy = Math.floor((locNum - 1) / cols) + 1;
    return { sx, sy };
};

// 서브그리드(원점 ox,oy) + 로컬셀(sx,sy) = 글로벌셀(gx,gy)
const toGlobalCell = (ox: number, oy: number, sx: number, sy: number) => {
    const gx = ox + (sx - 1) * 42.5;
    const gy = oy - (sx - 1) * 25 + (sy - 1) * 50;
    return { gx, gy };
};

// 최종: 전체스텝수, 현재스텝번호, locNum -> 글로벌셀(gx,gy)
const resolveGlobalCell = (totalSteps: number, stepNo: number, locNum: number) => {
    const part = PARTITIONS_BY_TOTAL_STEPS[totalSteps]?.[stepNo];
    const { cols, rows, ox, oy } = part;
    const { sx, sy } = localCellFromLocNum(locNum, cols);
    // 서브그리드 범위 넘어갈 경우
    const sxClamped = Math.min(sx, cols);
    const syClamped = Math.min(sy, rows);

    return toGlobalCell(ox, oy, sxClamped, syClamped);
};

const TemplateView = () => {
    // const { templateData } = useTemplateDetailStore();
    // const backgroundImage = `/cate-${templateData?.templateCateNo}-step-${templateData?.stepsList.length}.svg`;
    const backgroundImage = '/cate-2-step-4.svg'; // 테스트용 고정 경로

    console.log(resolveGlobalCell(1, 1, 1)); // 임시 사용

    return (
        <div className="relative mx-auto w-[800px] h-[800px] bg-white">
            <img draggable={false} className="absolute w-[800px] h-[800px] left-0 top-0" src={backgroundImage} />
        </div>
    );
};

export default TemplateView;
