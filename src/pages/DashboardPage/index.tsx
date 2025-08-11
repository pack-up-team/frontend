import { useState } from "react";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { AddIcon } from "../../assets";
import AlignDropdown from "./components/AlignDropdown";
import CategoryTabs from "./components/CategoryTabs";
import TemplateGrid from "./components/TemplateGrid";
import EmptyState from "./components/EmptyState";
import Footer from "../../components/Footer";
import type { TemplateListItem } from "../../stores/templateListStore";

// 더미 데이터
const DUMMY_TEMPLATES: TemplateListItem[] = [
    {
    templateNo: 1,
    templateNm: "출근 준비",
    categoryNm: "업무",
    regDt: "2025-08-01T10:00:00Z",
    updDt: "2025-08-01T10:00:00Z",
    isBookmarked: true,
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 2,
    templateNm: "여행 짐 싸기",
    categoryNm: "여행",
    regDt: "2025-07-30T14:00:00Z",
    updDt: "2025-07-30T14:00:00Z",
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 3,
    templateNm: "주간 업무 점검",
    categoryNm: "업무",
    regDt: "2025-07-29T08:30:00Z",
    updDt: "2025-07-29T10:00:00Z",
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 4,
    templateNm: "헬스장 갈 준비",
    categoryNm: "생활",
    regDt: "2025-07-28T18:00:00Z",
    updDt: "2025-07-29T09:00:00Z",
    isBookmarked: true,
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 5,
    templateNm: "출국 서류 확인",
    categoryNm: "여행",
    regDt: "2025-07-27T09:15:00Z",
    updDt: "2025-07-27T09:15:00Z",
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 6,
    templateNm: "회의 준비",
    categoryNm: "업무",
    regDt: "2025-07-26T13:45:00Z",
    updDt: "2025-07-26T14:30:00Z",
    isBookmarked: true,
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
];

const DashboardPage = () => {
    // const navigate = useNavigate();
    // 선택된 카테고리 상태
    const [selectedCategory, setSelectedCategory] = useState("전체");
    // 정렬 상태
    const [selectedAlign, setSelectedAlign] = useState("최근 수정일");

    // 카테고리별 개수 상태
    const [categoryCounts, setCategoryCounts] = useState({
        전체: 0,
        즐겨찾기: 0,
        업무: 0,
        생활: 0,
        여행: 0,
    });

    // 전체 템플릿 데이터
    const [allTemplates, setAllTemplates] = useState<TemplateListItem[]>(DUMMY_TEMPLATES);
    // 현재 화면에 보여줄 개수
    const [visibleCount, setVisibleCount] = useState(8);

    // onAlignChange: (option: string) => void;
    const handleAlignChange = (option: string) => {
        alert(option); // 정렬 기능은 이후 구현
    };

    // onChange: (category: string) => void;
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setVisibleCount(8);

        // TODO: 나중에 백엔드 API 연결 시 여기를 API 호출로 대체
        // 선택된 카테고리에 맞게 필터링
        if (category === "전체") {
            setAllTemplates(DUMMY_TEMPLATES);
        } else if (category === "즐겨찾기") {
            setAllTemplates(DUMMY_TEMPLATES.filter(t => t.isBookmarked));
        } else {
            setAllTemplates(DUMMY_TEMPLATES.filter(t => t.categoryNm === category));
        }
    };

    /*
    // 템플릿 불러오기 (API)
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axios.get("/api/templates", {
                    params: { category: selectedCategory },
                });
                setAllTemplates(res.data); // ✅ 예: [{ templateNo: 1, title: "...", ... }]
            } catch (err) {
                console.error("템플릿 불러오기 실패:", err);
            }
        };

        fetchTemplates();
    }, [selectedCategory]);
    */

    /*
    // 카테고리별 개수 불러오기 (API)
    useEffect(() => {
        setCurrentPage(1);
        setAllTemplates([]);
        setHasMore(true);
        fetchTemplatesWithSort(undefined, 1, true);
    }, [selectedCategory, selectedAlign]);

    // 더보기 버튼 클릭 시 다음 페이지 로드
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            const nextPage = currentPage + 1;
            fetchTemplatesWithSort(undefined, nextPage, false);
        }
    };

    // 모든 템플릿을 표시 (페이지네이션으로 관리)
    const visibleTemplates = allTemplates;

    return (
        <div className='flex w-full flex-col items-start gap-[8px] bg-[#FAFAFA] min-h-screen'>
            <div className="flex flex-col items-center gap-[40px] mb-[40px] self-stretch flex-1">
                <Header />
                <div className="pt-[124px] mx-auto flex w-[1200px] justify-between items-center">
                    <div className="flex items-center gap-[31px]">
                        <h2 className="text-[#141414] text-center font-pretendard text-[26px] font-bold leading-normal">내 템플릿 목록</h2>
                        {/* 새 템플릿 버튼 -> 1단계 모달 오픈 */}
                        <Button onClick={() => setIsTypeOpen(true)} className="w-[200px] h-11">
                            <AddIcon className="w-[18px] h-[18px]" />
                            <span className="text-white text-center font-pretendard text-[16px] font-medium leading-normal">새 템플릿</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[#141414] font-pretendard text-[16px] font-medium leading-normal">정렬</span>
                        <AlignDropdown selectedAlign={selectedAlign} onAlignChange={handleAlignChange} />
                    </div>
                </div>
                <section className="flex w-[1200px] flex-col items-center gap-[32px]">
                    <CategoryTabs counts={categoryCounts} selected={selectedCategory} onChange={handleCategoryChange} />
                    {allTemplates.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <TemplateGrid templates={visibleTemplates} />
                            {visibleCount < allTemplates.length && (
                                <Button onClick={() => setVisibleCount(prev => prev + 8)} className="w-[343px] h-[50px]" variant="line">더보기</Button>
                            )}
                        </>
                    )}
                </section>
            </div>
            <Footer />

            {/* 모달들 (포털로 최상단 렌더) */}
            <AddTemplateTypeModal
                isOpen={isTypeOpen}
                onClose={() => setIsTypeOpen(false)}
                onPick={(type) => {
                    if (type === "new") {
                        setIsTypeOpen(false);
                        // TODO: navigate 사용해서 신규 템플릿 편집 화면으로 이동
                    } else {
                        setIsTypeOpen(false);
                        setIsPresetOpen(true);
                    }
                }}
            />
            <PresetSetModal
                isOpen={isPresetOpen}
                onClose={() => setIsPresetOpen(false)}
                onConfirm={(setId) => {
                    setIsPresetOpen(false);
                    console.log(setId); // 린트 에러 방지를 위해 임시로 넣어둠
                    // TODO: navigate 사용해서 간편 템플릿 편집 화면으로 이동
                }}
            />
        </div>
    );
};

export default DashboardPage;