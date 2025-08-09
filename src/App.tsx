import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { routes } from './routes';
import ScrollToTop from './components/ScrollToTop';
import authService from './api/authService';

const App = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// 자동 로그인 체크
	useEffect(() => {
		const checkAutoLogin = async () => {
			try {
				// SNS 콜백 페이지나 이미 대시보드에 있으면 체크하지 않음
				if (location.pathname === '/auth/sns-callback' || location.pathname === '/dashboard') {
					return;
				}

				const isLoggedIn = await authService.checkAutoLogin();
				
				if (isLoggedIn) {
					// 로그인되어 있고 인증 페이지에 있으면 대시보드로 이동
					if (location.pathname === '/auth' || location.pathname === '/') {
						console.log('자동 로그인 성공, 대시보드로 이동');
						navigate('/dashboard');
					}
				} else {
					// 로그인되어 있지 않고 보호된 페이지에 있으면 로그인 페이지로 이동
					if (location.pathname === '/dashboard') {
						console.log('로그인이 필요합니다');
						navigate('/auth?mode=login');
					}
				}
			} catch (error) {
				console.error('자동 로그인 체크 실패:', error);
				// 에러 발생 시 대시보드에 있으면 로그인 페이지로 이동
				if (location.pathname === '/dashboard') {
					navigate('/auth?mode=login');
				}
			}
		};

		checkAutoLogin();
	}, [navigate, location.pathname]);

	return (
		<>
			<ScrollToTop />
			<Routes>
				{routes.map((r) => (
					<Route key={r.path} path={r.path} element={r.element} />
				))}
			</Routes>
		</>
	);
};

export default App