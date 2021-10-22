import { useContext, useEffect } from "react";
import { webSocketContext } from "./providers/WebSocketProvider";
import endpoints from "./constants/endpoints";

const App = () => {
	const { client } = useContext(webSocketContext);

	useEffect(() => {
		if (!client) return;

		client.subscribe(endpoints.TOPIC_CHAT, (message) => {
			console.log(message);
		});

		return () => client.unsubscribe(endpoints.TOPIC_CHAT);
	}, [client]);

	const greeting = () => {
		console.log("clicked");

		if (!client) return;

		client.publish({
			destination: endpoints.APP_GREETING,
			body: "Hello, STOMP",
		});
	};

	return (
		<div>
			<h1>Hello React!</h1>
			<button onClick={greeting}>SEND</button>
		</div>
	);
};

export default App;
