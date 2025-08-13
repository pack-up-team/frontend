import { useEffect, useMemo, useState } from "react";
import { useEditorStore } from "../../../../stores/editorStore";
import type { Category } from "../../../../stores/editorStore";
import { SearchIcon, CloseFilledIcon, ResultNoneIcon } from "../../../../assets";
import Button from "../../../../components/Button";

const API_URL = "https://packupapi.xyz/temp/getCateTemplateObject";

// 카테고리 -> cateNo 매핑
const CATE_NO: Record<Category, number> = {
    office: 1,
    daily: 2,
    trip: 3,
};

const CATEGORY_LABELS: Record<Category, string> = {
    office: "업무",
    daily: "생활",
    trip: "여행",
};

// 서버 응답 타입
type BackendRow = {
    objNo: number;
    objNm: string;
    objEnm: string;
    cateNo: number;
    // 그 외 필드 무시
};

type ApiResponse =
    | {
          responseText: "success";
          message: string;
          objList: BackendRow[]; // 성공이면 항상 배열
      }
    | {
          responseText: "fail";
          message: string;
          objList: BackendRow[] | null; // []: 조회 결과 없음, null: 서버 오류
      };

type CatalogItem = {
    id: number; // objNo
    name: string; // objEnm
    nameKo: string;
    cate: Category;
};

// 전체 스텝 수에 따른 스텝별 최대 수용량 테이블
const CAPACITY_BY_TOTAL_STEPS: Record<number, number[]> = {
    1: [36],
    2: [18, 18],
    3: [9, 9, 18],
    4: [9, 9, 9, 9],
};

function getCapacitiesByStepsCount(count: number): number[] {
    return CAPACITY_BY_TOTAL_STEPS[count] ?? new Array(count).fill(9);
}

type SlimStep = { id: number; itemIds: number[] };

// 첫 번째로 빈 칸이 있는 스텝을 찾아 반환
function pickFirstStepHasSpace(
    steps: Array<{ id: number; itemIds: number[] }>
): number | null {
    const caps = getCapacitiesByStepsCount(steps.length);
    for (let i = 0; i < steps.length; i++) {
        const used = steps[i].itemIds?.length ?? 0;
        if (used < (caps[i] ?? 0)) return steps[i].id;
    }
    return null;
}

function isAbortError(e: unknown): boolean {
    return (e instanceof DOMException || e instanceof Error) && e.name === "AbortError";
}

export default function AddItemPanel() {
    const steps = useEditorStore((s) => s.steps);
    const addItemToStep = useEditorStore((s) => s.addItemToStep);

    const [tab, setTab] = useState<"ALL" | "RECO">("ALL"); // 서버에서 추천이 없으므로 지금은 동작 동일
    const [q, setQ] = useState("");
    const [cate, setCate] = useState<Category>("office");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [serverList, setServerList] = useState<CatalogItem[]>([]);

    const slimSteps = useMemo<SlimStep[]>(
        () => steps.map((st) => ({ id: st.id, itemIds: st.itemIds ?? [] })),
        [steps]
    );

    const remainingSlots = useMemo(() => {
        const caps = getCapacitiesByStepsCount(steps.length);
        return steps.reduce((acc, st, i) => {
            const used = st.itemIds?.length ?? 0;
            return acc + Math.max(0, (caps[i] ?? 0) - used);
        }, 0);
    }, [steps]);
    const isFull = remainingSlots <= 0;

    // cate 변경 시 API 호출
    useEffect(() => {
        if (!cate) return;
        const controller = new AbortController();

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cateNo: CATE_NO[cate] }),
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const json = (await res.json()) as ApiResponse;

                // 실패 케이스 처리
                if (json.responseText === "fail") {
                    if (json.objList === null) {
                        // 서버 오류
                        setServerList([]);
                        setError(json.message || "서버 오류가 발생했습니다.");
                        return;
                    }
                    // objList === [] : 조회 결과 없음
                    setServerList([]);
                    setError(null);
                    return;
                }

                // 성공
                const rows = json.objList ?? [];
                // 중복 objNo 제거
                const dedup = new Map<number, BackendRow>();
                for (const r of rows) {
                    if (typeof r.objNo === "number") dedup.set(r.objNo, r);
                }
                const mapped: CatalogItem[] = Array.from(dedup.values()).map((r) => ({
                    id: Number(r.objNo),
                    name: String(r.objEnm ?? ""),
                    nameKo: String(r.objNm ?? r.objEnm ?? ""),
                    cate,
                }));
                setServerList(mapped);
            } catch (e: unknown) {
                if (isAbortError(e)) return;
                const msg = e instanceof Error ? e.message : "요청 중 오류가 발생했습니다.";
                setServerList([]);
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        run();
        return () => controller.abort();
    }, [cate]);

    // 탭/검색 필터 (추천 탭은 지금은 동일 동작)
    const filtered = useMemo(() => {
        let arr = serverList;
        const n = q.trim();
        if (n) {
            const v = n.toLowerCase();
            arr = arr.filter((x) =>
                x.name.toLowerCase().includes(v)
                || (x.nameKo && x.nameKo.includes(n))
            );
        }
        return arr;
    }, [serverList, q]);

    return (
        <div className="inline-flex flex-col items-start gap-4">
            {/* 서브 탭 */}
            <div className="flex items-center self-stretch">
                <button
                    className={`flex h-[50px] py-4 justify-center items-center gap-2 [flex:1_0_0] text-center font-pretendard text-lg font-semibold leading-normal ${tab === "ALL" ? "border-b-[3px] border-[#775CFF] text-[#141414]" : "text-[#949494]"}`}
                    onClick={() => setTab("ALL")}
                >
                    전체
                </button>
                <button
                    className={`flex h-[50px] py-4 justify-center items-center gap-2 [flex:1_0_0] text-center font-pretendard text-lg font-semibold leading-normal ${tab === "RECO" ? "border-b-[3px] border-[#775CFF] text-[#141414]" : "text-[#949494]"}`}
                    onClick={() => setTab("RECO")}
                >
                    추천
                </button>
            </div>

            {/* 검색 */}
            <div className="flex w-[400px] h-14 px-4 py-2 items-center gap-2 flex-shrink-0 rounded-lg border border-[#CCC] focus-within:border-[#141414]">
                <SearchIcon className="w-[18px] h-[18px]" />
                <input
                    className="outline-none border-none flex-1 placeholder:text-[#949494] placeholder:font-pretendard placeholder:text-base placeholder:font-medium placeholder:leading-normal"
                    placeholder="준비물 검색"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                {q && (
                    <div className="flex h-[38px] pr-0 pl-[22px] py-[11px] justify-end items-center">
                        <button className="w-[16px] h-[16px] cursor-pointer" onClick={() => setQ("")}>
                            <CloseFilledIcon className="w-[16px] h-[16px]" />
                        </button>
                    </div>
                )}
            </div>

            {/* divider */}
            <div className="h-0 self-stretch">
                <svg xmlns="http://www.w3.org/2000/svg" width="401" height="3" viewBox="0 0 401 3" fill="none">
                    <path d="M0.75 1.32812H400.75" stroke="#F0F0F0" stroke-width="2"/>
                </svg>
            </div>

            {/* 카테고리 */}
            <div className="flex w-[400px] flex-col items-start gap-3">
                <span className="self-stretch text-[#141414] font-pretendard text-base font-bold leading-normal">카테고리</span>
                <div className="flex items-center gap-4 self-stretch">
                    {(["office", "daily", "trip"] as const).map((c) => (
                        <Button
                            key={c}
                            variant={cate === c ? "fill" : "line"}
                            className={`flex-1 h-[38px] !p-0 ${cate === c ? "!bg-[#5736FF]" : ""}`}
                            onClick={() => setCate(c)}
                        >
                            {CATEGORY_LABELS[c]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* divider */}
            <div className="h-0 self-stretch">
                <svg xmlns="http://www.w3.org/2000/svg" width="401" height="3" viewBox="0 0 401 3" fill="none">
                    <path d="M0.75 1.32812H400.75" stroke="#F0F0F0" stroke-width="2"/>
                </svg>
            </div>

            {/* 목록 영역 */}
            {loading ? (
                <p className="mx-auto pt-[166px] text-[#707070] text-center font-pretendard text-base font-medium leading-[140%]">불러오는 중…</p>
            ) : error ? (
                <p className="mx-auto pt-[166px] text-[#D90050] text-center font-pretendard text-base font-medium leading-[140%]">{error}</p>
            ) : filtered.length === 0 ? (
                <div className="flex py-[100px] flex-col items-center gap-4 [flex:1_0_0] self-stretch">
                    <ResultNoneIcon className="w-[50px] h-[50px]" />
                    <p className="mx-auto text-[#707070] text-center font-pretendard text-base font-medium leading-[140%]">검색 결과가 없습니다.</p>
                </div>
            ) : (
                // 간격 확인 필요
                <ul className="w-full grid grid-cols-4 gap-y-4 overflow-y-auto">
                    {filtered.map((c) => {
                        return (
                            <li key={c.id}>
                                <button
                                    className="flex w-[90px] h-[90px] justify-center items-center rounded-lg border border-transparent hover:border-[#8D76FF]"
                                    disabled={isFull}
                                    onClick={() => {
                                        const stepId = pickFirstStepHasSpace(slimSteps);
                                        if (!stepId) return; // 가득 찼으면 무시
                                        addItemToStep(stepId, {
                                            catalogId: c.id,
                                            name: c.name,
                                            cate: c.cate,
                                        });
                                    }}
                                >
                                    <img
                                        src={`https://packupapi.xyz/images/object/${c.cate}/${c.name}.png`}
                                        alt={c.name}
                                    />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
