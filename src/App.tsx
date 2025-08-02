import { Route, Routes } from "react-router-dom";

//Pages
import DashboardPage from './pages/DashboardPage';
import CallbackPage from "./pages/CallbackPage";
import NotFoundPage from "./pages/404Page";
import ProjectPage from "./pages/ProjectPage";
import BoardPage from "./pages/BoardPage";
import LandingPage from "./pages/LandingPage";
import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectSettingsPage from "./pages/ProjectSettingsPage";
import AllUsersProjectPage from "./pages/AllUsersProjectPage";

//Components
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import MainLayout from "./components/Layouts/MainLayout";


function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={<LandingPage />} />
			<Route element={<ProtectedAuthRoute> <MainLayout /> </ProtectedAuthRoute>}>
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/tasks" element={<TasksPage />} />
				<Route path="/projects" element={<ProjectsPage />} />
				<Route path="/project/:projectId" element={<ProjectPage />} />
				<Route path="/project/:projectId/users" element={<AllUsersProjectPage />} />
				<Route path="/project/:projectId/settings" element={<ProjectSettingsPage />} />
				<Route path="/project/:projectId/:boardId" element={<BoardPage />} />
			</Route>
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
