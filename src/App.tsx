import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
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
