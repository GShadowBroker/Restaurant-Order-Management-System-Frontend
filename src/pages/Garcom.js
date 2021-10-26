import React, { useEffect, useState, useContext } from "react";
import { getOrders, updateStatus } from "../service/restService";
import Loading from "../components/Loading";
import Error from "../components/Error";
import {
	Box,
	List,
	ListItem,
	Avatar,
	ListItemAvatar,
	ListItemText,
	Divider,
	Container,
	Typography,
	Button,
	Fade,
} from "@material-ui/core";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import orderStatus from "../constants/orderStatus";
import { webSocketContext } from "../providers/WebSocketProvider";
import endpoints from "../constants/endpoints";

const Garcom = () => {
	const { client } = useContext(webSocketContext);

	const [loadingOrders, setLoadingOrders] = useState(true);
	const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("Houve um erro inesperado");

	const [orders, setOrders] = useState([]);

	const loadAllOrders = async () => {
		const response = await getOrders();
		if (response?.data) {
			setOrders(response.data);
			setLoadingOrders(false);
		} else {
			const errorMessage = "Houve um erro de comunicação com o servidor.";
			console.error(errorMessage);
			setLoadingOrders(false);
			setErrorMessage(errorMessage);
			setError(true);
		}
	};

	const changeStatus = async (order) => {
		setLoadingUpdateStatus(true);
		const nextStatus = orderStatus[order.status].next;

		if (!nextStatus) {
			console.error("Invalid status");
			setLoadingUpdateStatus(false);
			return;
		}

		const response = await updateStatus(order.id, nextStatus);

		if (response && response.status === 200) {
			// Notify everybody
			client.publish({ destination: endpoints.APP_ORDER_NOTIFY });
		} else {
			const errorMessage = "Houve um erro de comunicação com o servidor.";
			console.error(errorMessage);
			setErrorMessage(errorMessage);
			setError(true);
		}

		setLoadingUpdateStatus(false);
	};

	useEffect(() => {
		loadAllOrders();
	}, []);

	useEffect(() => {
		if (!client) return;

		client.subscribe(endpoints.TOPIC_ORDER, (message) => {
			loadAllOrders();
		});

		return () => client.unsubscribe(endpoints.TOPIC_ORDER);
	}, [client]);

	const isUpdateButtonDisabled = (order) => {
		if (loadingUpdateStatus) return true;

		return order.status !== "AWAITING_DELIVERY";
	};

	if (loadingOrders) return <Loading />;
	else if (error) return <Error errorMessage={errorMessage} />;
	else if (!orders || orders.length === 0) {
		return (
			<Container maxWidth="md">
				<Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
					<Typography variant="body1">Não há pedidos ativos.</Typography>
				</Box>
			</Container>
		);
	}

	return (
		<Fade in={true}>
			<Container maxWidth="md">
				{orders?.length > 0 && (
					<Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
						<Typography variant="h6">Pedidos a retirar:</Typography>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								p: 2,
							}}
						>
							<List
								sx={{
									width: "100%",
									bgcolor: "background.paper",
								}}
							>
								{orders
									.filter(
										(el) =>
											el.status === "AWAITING_DELIVERY" ||
											el.status === "DELIVERED"
									)
									.map((order) => (
										<div key={order.id} style={{ margin: "30px 0px 5px 0px" }}>
											<Divider variant="inset" component="li" />
											<ListItem
												alignItems="flex-start"
												secondaryAction={
													isUpdateButtonDisabled(order) ? null : (
														<Button onClick={() => changeStatus(order)}>
															{loadingUpdateStatus
																? "carregando"
																: orderStatus[order.status].text}
														</Button>
													)
												}
											>
												<ListItemAvatar>
													<Avatar>
														<RestaurantIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary={`ID DO PEDIDO: ${order.id}`}
													secondary={
														<React.Fragment>
															<Typography
																component="span"
																variant="body2"
																sx={{ display: "block" }}
															>
																<strong>Cliente: </strong>{" "}
																{`${order.customer.firstName} ${order.customer.lastName}`}
															</Typography>
															<Typography
																component="span"
																variant="body2"
																color="text.primary"
																sx={{ display: "block" }}
															>
																R${" "}
																{(
																	order.items
																		.map((el) => el.price)
																		.reduce((acc, value) => acc + value) / 100
																).toFixed(2)}
															</Typography>
															<Typography
																component="span"
																variant="body2"
																color={orderStatus[order.status].color}
																sx={{ display: "block" }}
															>
																<strong>
																	{orderStatus[order.status].name}
																</strong>
															</Typography>
															{order.observation && (
																<Typography
																	component="span"
																	variant="body2"
																	sx={{ display: "block" }}
																>
																	<strong>Obs.:</strong> {order.observation}
																</Typography>
															)}
														</React.Fragment>
													}
												/>
											</ListItem>
											<List dense={true}>
												{order.items.map((dish) => (
													<ListItem key={dish.id} sx={{ marginLeft: 10 }}>
														<ListItemAvatar>
															<Avatar alt="alt" src={dish.imageUrl} />
														</ListItemAvatar>
														<ListItemText
															primary={dish.name}
															secondary={`R$ ${(dish.price / 100).toFixed(2)}`}
														/>
													</ListItem>
												))}
											</List>
										</div>
									))}
							</List>
						</Box>
					</Box>
				)}
			</Container>
		</Fade>
	);
};

export default Garcom;
