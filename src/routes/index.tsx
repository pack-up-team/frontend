import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';

export const routes = [
    { path: '/', element: <LandingPage /> },
    { path: '/auth', element: <AuthPage /> }
];
