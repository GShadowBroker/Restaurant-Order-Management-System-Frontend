import { createContext, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import endpoints from "../constants/endpoints";

export const webSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
	const [client, setClient] = useState(null);

	useEffect(() => {
		// const socket = new SockJS(endpoints.BROKER_URL);

		const stompClient = new Client();

		stompClient.webSocketFactory = () => new SockJS(endpoints.BROKER_URL);

		stompClient.reconnectDelay = 5000;

		stompClient.onConnect = (frame) => {
			console.log("connected to server successfully");
			setClient(stompClient);
		};

		stompClient.onStompError = (frame) => {
			console.log("Broker reported error: " + frame.headers["message"]);
			console.log("Additional details: " + frame.body);
		};

		stompClient.activate();
	}, []);

	const webSocketValues = { client };

	return (
		<webSocketContext.Provider value={webSocketValues}>
			{children}
		</webSocketContext.Provider>
	);
};
