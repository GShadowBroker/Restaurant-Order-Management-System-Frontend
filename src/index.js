import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { WebSocketProvider } from "./providers/WebSocketProvider";

ReactDOM.render(
	<React.StrictMode>
		<WebSocketProvider>
			<CssBaseline />
			<App />
		</WebSocketProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
