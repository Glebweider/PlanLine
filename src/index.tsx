import ReactDOM from "react-dom/client";
import "./styles/index.scss";

import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "./components/Alert/context";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<AlertProvider>
				<App />
			</AlertProvider>
		</BrowserRouter>
	</Provider>
);
