import ReactDOM from "react-dom/client";
import "./styles/index.scss";

import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "./components/Alert/context";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<DndProvider backend={HTML5Backend}>
				<AlertProvider>
					<App />
				</AlertProvider>
			</DndProvider>
		</BrowserRouter>
	</Provider>
);
