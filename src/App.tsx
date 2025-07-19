import { Route, Routes } from "react-router-dom";

//Pages
import HomePage from './pages/HomePage';
import CallbackPage from "./pages/CallbackPage";
import NotFoundPage from "./pages/404Page";
import ProjectPage from "./pages/ProjectPage";
import BoardPage from "./pages/BoardPage";

//Components
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";


function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<ProtectedAuthRoute>
						<HomePage />
					</ProtectedAuthRoute>
				} />
			<Route
				path="/project/:projectId"
				element={
					<ProtectedAuthRoute>
						<ProjectPage />
					</ProtectedAuthRoute>
				} />
			<Route
				path="/project/:projectId/board/:boardId"
				element={
					<ProtectedAuthRoute>
						<BoardPage />
					</ProtectedAuthRoute>
				} />
			<Route 
				path='/callback' 
				element={<CallbackPage />} />
			<Route 
				path='*' 
				element={<NotFoundPage />} />
		</Routes>
	);
}

export default App;
