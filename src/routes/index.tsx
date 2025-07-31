import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';

export const routes = [
    { path: '/', element: <LandingPage /> },
    { path: '/auth', element: <AuthPage /> },
    { path: '/dashboard', element: <DashboardPage /> }
];
