import { useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

// 로그인/회원가입 탭 스타일
const tabStyles = {
    inactive: "text-[#949494] text-center font-pretendard text-[18px] font-semibold leading-normal flex h-[50px] py-[16px] justify-center items-center gap-[8px] flex-1",
    active: "border-b-[3px] border-[#775CFF] text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal flex h-[50px] py-[16px] justify-center items-center gap-[8px] flex-1",
};

const AuthPage = () => {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = (params.get("mode") as "login" | "signup") || "login";
    
    // SNS 로그인 후 처리
    useEffect(() => {
        const userInfo = params.get('userInfo');
        const error = params.get('error');
        
        if (userInfo || error) {
            // SNS 콜백 페이지로 리다이렉트
            navigate('/auth/sns-callback?' + params.toString());
        }
    }, [params, navigate]);
    
    const switchMode = useCallback(
        (nextMode: "login" | "signup") => {
            setParams({ mode: nextMode });
        },
        [setParams]
    );

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA]">
            <Header pageType="auth" />
            <main className="flex-1 flex justify-center items-center pt-[116px] pb-[40px]">
                <div className="flex w-[600px] px-4 py-10 flex-col items-end rounded-[18px] bg-white shadow-[0,0,16px,0,rgba(0,0,0,0.02)]">
                    <div className="flex flex-col items-center gap-10 self-stretch">
                        {/* 로그인/회원가입 탭 전환 */}
                        <div className="flex w-[400px] items-center">
                            <button 
                                onClick={() => switchMode("login")} 
                                className={mode === "login" ? tabStyles.active : tabStyles.inactive}
                            >
                                로그인
                            </button>
                            <button 
                                onClick={() => switchMode("signup")} 
                                className={mode === "signup" ? tabStyles.active : tabStyles.inactive}
                            >
                                회원가입
                            </button>
                        </div>
                        {/* 폼 전환 */}
                        {mode === 'login' ? <LoginForm /> : <SignupForm />}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AuthPage;
