import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { AddIcon } from "../../assets";
import AlignDropdown from "./components/AlignDropdown";
import CategoryTabs from "./components/CategoryTabs";
import TemplateGrid from "./components/TemplateGrid";
import EmptyState from "./components/EmptyState";
import Footer from "../../components/Footer";
import type { TemplateListItem } from "../../stores/templateListStore";

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
    {
    templateNo: 7,
    templateNm: "청소하기",
    categoryNm: "생활",
    regDt: "2025-07-25T17:00:00Z",
    updDt: "2025-07-25T17:00:00Z",
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 8,
    templateNm: "장보기 리스트",
    categoryNm: "생활",
    regDt: "2025-07-24T16:30:00Z",
    updDt: "2025-07-24T16:30:00Z",
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 9,
    templateNm: "운동 루틴",
    categoryNm: "생활",
    regDt: "2025-07-23T19:10:00Z",
    updDt: "2025-07-23T19:10:00Z",
    isBookmarked: true,
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
    {
    templateNo: 10,
    templateNm: "회사 행사 준비",
    categoryNm: "업무",
    regDt: "2025-07-22T11:00:00Z",
    updDt: "2025-07-22T12:00:00Z",
    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
    },
];

const DashboardPage = () => {
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

    // onAlignChange: (option: string) => void;
    const handleAlignChange = (option: string) => {
        setSelectedAlign(option);
        // 선택값만 갱신; 데이터 로드는 useEffect에서 처리
    };

    // onChange: (category: string) => void;
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        // 선택값만 갱신; 데이터 로드는 useEffect에서 처리
    };

    // 즐겨찾기 상태 변경 시 템플릿 목록 새로고침
    const handleBookmarkToggle = () => {
        setCurrentPage(1);
        setAllTemplates([]);
        setHasMore(true);
        fetchTemplates(undefined, 1, true);
    };

    // 카테고리를 API 값으로 변환하는 함수
    const getCategoryValue = (category: string) => {
        switch (category) {
            case "전체":
                return "";
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
    const fetchTemplates = useCallback(async (alignOption?: string, page?: number, isReset?: boolean) => {
        const targetPage = page || currentPage;
        const sortOption = alignOption || selectedAlign;
        const token = localStorage.getItem('token');

        if (isReset) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const categoryValue = getCategoryValue(selectedCategory);
            const requestBody: {
                page: number;
                sort: number;
                cateNo?: string;
            } = {
                page: targetPage,
                sort: getAlignValue(sortOption)
            };

            // 전체가 아닌 경우에만 category 필드 추가
            if (categoryValue) {
                requestBody.cateNo = categoryValue;
            }

            console.log('API 요청:', requestBody);

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
            console.log('API 응답:', responseData);

            const templates = responseData.templateDataList || [];
            const templateCntList: TemplateCntList = responseData.templateCntList;

            // 카테고리 개수 업데이트 (첫 페이지일 때만)
            if (targetPage === 1 && templateCntList) {
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

            // 첫 페이지이거나 리셋인 경우 새로 설정, 아니면 기존 데이터에 추가
            if (isReset || targetPage === 1) {
                setAllTemplates(convertedTemplates);
            } else {
                setAllTemplates(prev => [...prev, ...convertedTemplates]);
            }

            // 더 가져올 데이터가 있는지 확인 (가져온 데이터가 8개 미만이면 마지막 페이지)
            setHasMore(templates.length >= 8);
            setCurrentPage(targetPage);

        } catch (err) {
            console.error("템플릿 불러오기 실패:", err);
            if (isReset || targetPage === 1) {
                setAllTemplates(DUMMY_TEMPLATES);
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [selectedCategory, selectedAlign, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        setAllTemplates([]);
        setHasMore(true);
        fetchTemplates(undefined, 1, true);
    }, [selectedCategory, selectedAlign, fetchTemplates]);

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
                        <Button className="w-[200px] h-11">
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
        </div>
    );
};

export default DashboardPage;
