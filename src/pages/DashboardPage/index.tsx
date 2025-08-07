import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { AddIcon } from "../../assets";
import AlignDropdown from "./components/AlignDropdown";
import CategoryTabs from "./components/CategoryTabs";
import TemplateGrid from "./components/TemplateGrid";
import EmptyState from "./components/EmptyState";
import Footer from "../../components/Footer";
import type { TemplateListItem } from "../../stores/templateListStore";
import AddTemplateTypeModal from "./components/AddTemplateTypeModal";
import PresetSetModal from "./components/PresetSetModal";

// API 응답 템플릿 타입 정의
interface ApiTemplate {
    templateNo: number;
    templateNm: string;
    cateNm: string;
    regDt: string;
    updDt?: string;
    isFavorite: "Y" | "N";
}

// API 응답 카운트 타입 정의
interface TemplateCntList {
    totalCnt: number;
    totalDailyCnt: number;
    totalFavoriteCnt: number;
    totalOfficeCnt: number;
    totalTripCnt: number;
}

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
    const [allTemplates, setAllTemplates] = useState<TemplateListItem[]>([]);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(false);
    // 더보기 로딩 상태
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    // 현재 페이지
    const [currentPage, setCurrentPage] = useState(1);
    // 더 가져올 데이터가 있는지 여부
    const [hasMore, setHasMore] = useState(true);

    // 새 템플릿 버튼 클릭 시 뜨는 모달 상태
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isPresetOpen, setIsPresetOpen] = useState(false);

    // onAlignChange: (option: string) => void;
    const handleAlignChange = (option: string) => {
        alert(option); // 정렬 기능은 이후 구현
    };

    // onChange: (category: string) => void;
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setVisibleCount(8);
        // 카테고리 변경 시 현재 정렬 기준으로 다시 데이터 불러오기
        // useEffect에서 처리됨
    };

    // 카테고리를 API 값으로 변환하는 함수
    const getCategoryValue = (category: string) => {
        switch (category) {
            case "전체":
                return ""; // 전체는 값이 없음
            case "즐겨찾기":
                return "0";
            case "업무":
                return "1";
            case "생활":
                return "2";
            case "여행":
                return "3";
            default:
                return undefined;
        }
    };

    // 정렬 기준을 API 값으로 변환하는 함수
    const getAlignValue = (align: string) => {
        switch (align) {
            case "최근 수정일":
                return 0;
            case "최근 생성일":
                return 1;
            case "알림 시간 임박":
                return 2;
            case "템플릿명":
                return 3;
            default:
                return 0;
        }
    };

    // 템플릿 불러오기 함수
    const fetchTemplatesWithSort = async (alignOption?: string) => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        console.log("token : "+token)
        const sortOption = alignOption || selectedAlign;
        
        try {
            const categoryValue = getCategoryValue(selectedCategory);
            const requestBody: {
                page: number;
                sort: number;
                cateNo?: string;
            } = {
                page: 1,
                sort: getAlignValue(sortOption)
            };
            
            // 전체가 아닌 경우에만 category 필드 추가
            if (categoryValue) {
                requestBody.cateNo = categoryValue;
            }

            const response = await fetch("https://packupapi.xyz/temp/getUserTemplateDataList", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('템플릿 불러오기 실패');
            }
            
            const responseData = await response.json();
            console.log("템플릿 데이터:", responseData);
            
            const templates = responseData.templateDataList || [];
            const templateCntList: TemplateCntList = responseData.templateCntList;
            
            // 카테고리 개수 업데이트
            if (templateCntList) {
                setCategoryCounts({
                    전체: templateCntList.totalCnt,
                    즐겨찾기: templateCntList.totalFavoriteCnt,
                    업무: templateCntList.totalOfficeCnt,
                    생활: templateCntList.totalDailyCnt,
                    여행: templateCntList.totalTripCnt,
                });
            }
            
            const convertedTemplates = templates.map((template: ApiTemplate) => ({
                templateNo: template.templateNo,
                templateNm: template.templateNm,
                categoryNm: template.cateNm,
                regDt: template.regDt,
                updDt: template.updDt || template.regDt,
                isBookmarked: template.isFavorite === "Y",
                thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
            }));
            
            setAllTemplates(convertedTemplates);
        } catch (err) {
            console.error("템플릿 불러오기 실패:", err);
            setAllTemplates(DUMMY_TEMPLATES);
        } finally {
            setIsLoading(false);
        }
    };

        fetchTemplates();
    }, [selectedCategory]);

    useEffect(() => {
        fetchTemplatesWithSort();
    }, [selectedCategory, selectedAlign]);

    // 더보기 버튼 클릭 시 다음 페이지 로드
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            const nextPage = currentPage + 1;
            fetchTemplates(undefined, nextPage, false);
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
                    {isLoading ? (
                        <div className="pt-[50px] flex justify-center items-center">
                            <p className="text-[#707070] text-center font-pretendard text-[16px] font-medium leading-[140%]">
                                템플릿을 불러오는 중...
                            </p>
                        </div>
                    ) : allTemplates.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <TemplateGrid templates={visibleTemplates} onBookmarkToggle={handleBookmarkToggle} />
                            {hasMore && (
                                <Button 
                                    onClick={handleLoadMore} 
                                    disabled={isLoadingMore}
                                    className="w-[343px] h-[50px]" 
                                    variant="line"
                                >
                                    {isLoadingMore ? '불러오는 중...' : '더보기'}
                                </Button>
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