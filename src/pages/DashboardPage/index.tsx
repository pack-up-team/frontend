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

    // 카테고리별 개수 상태
    // const [categoryCounts, setCategoryCounts]
    const [categoryCounts] = useState({
        전체: 10,
        즐겨찾기: 4,
        업무: 4,
        생활: 4,
        여행: 2,
    });

    // 전체 템플릿 데이터
    const [allTemplates, setAllTemplates] = useState<TemplateListItem[]>([]);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(false);
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

    // 템플릿 불러오기 (API) - POST 방식으로 변경
    useEffect(() => {
        const fetchTemplates = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8080/temp/getUserTemplateDataList", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 쿠키의 JWT 토큰 자동 포함
                    body: JSON.stringify({
                        category: selectedCategory,
                        page: 1
                    })
                });

                if (!response.ok) {
                    throw new Error('템플릿 불러오기 실패');
                }
                
                console.log("템플릿 데이터 response :", response);

                const responseData = await response.json();
                console.log("템플릿 데이터:", responseData);
                
                // responseData.templateDataList에서 실제 템플릿 배열 추출
                const templates = responseData.templateDataList || [];
                
                // API 데이터를 기존 TemplateListItem 형식에 맞게 변환
                const convertedTemplates = templates.map((template: any) => ({
                    templateNo: template.templateNo,
                    templateNm: template.templateNm,
                    categoryNm: template.cateNm, // 카테고리 정보가 없으면 기본값 설정
                    regDt: template.regDt,
                    updDt: template.updDt || template.regDt,
                    isBookmarked: template.isFavorite === "Y",
                    thumbnail: "https://core-cdn-fe.toss.im/image/optimize/?src=https://blog-cdn.tosspayments.com/wp-content/uploads/2021/08/28011146/semo9.png?&w=3840&q=75"
                }));
                
                setAllTemplates(convertedTemplates);
            } catch (err) {
                console.error("템플릿 불러오기 실패:", err);
                // 에러 시 더미 데이터 사용
                setAllTemplates(DUMMY_TEMPLATES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, [selectedCategory]);

    /*
    // 카테고리별 개수 불러오기 (API)
    useEffect(() => {
        const fetchCategoryCounts = async () => {
            try {
                const res = await axios.get("/api/dashboard/categories");
                // 🔗 예시 응답: { 전체: 12, 즐겨찾기: 2, 업무: 5, 생활: 3, 여행: 1 }
                setCategoryCounts(res.data);
            } catch (err) {
                console.error("카테고리 개수 불러오기 실패:", err);
            }
        };

        fetchCategoryCounts();
    }, []);
    */

    // 현재 보여줄 템플릿 목록
    const visibleTemplates = allTemplates.slice(0, visibleCount);

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
                        <AlignDropdown onAlignChange={handleAlignChange} />
                    </div>
                </div>
                <section className="flex w-[1200px] flex-col items-center gap-[32px]">
                    <CategoryTabs counts={categoryCounts} selected={selectedCategory} onChange={handleCategoryChange} />
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <span className="text-[#707070] font-pretendard text-[16px]">템플릿을 불러오는 중...</span>
                        </div>
                    ) : allTemplates.length === 0 ? (
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
        </div>
    );
};

export default DashboardPage;