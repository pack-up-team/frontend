import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import SnsCallback from '../pages/AuthPage/components/SnsCallback';

export const routes = [
    { path: '/', element: <LandingPage /> },
    { path: '/auth', element: <AuthPage /> },
    { path: '/auth/sns-callback', element: <SnsCallback /> }, // SNS 콜백 라우트 추가
    { path: '/dashboard', element: <DashboardPage /> }
];
