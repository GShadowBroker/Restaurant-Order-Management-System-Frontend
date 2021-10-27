import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams } from "react-router";
import {
	List,
	ListItem,
	Avatar,
	ListItemAvatar,
	ListItemText,
	Divider,
	IconButton,
	Container,
	Typography,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	TextField,
	Fab,
	Fade,
} from "@material-ui/core";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import DeleteIcon from "@material-ui/icons/Delete";
import PlusIcon from "@material-ui/icons/Add";
import { Box } from "@material-ui/system";
import Loading from "../components/Loading";
import { webSocketContext } from "../providers/WebSocketProvider";
import endpoints from "../constants/endpoints";
import orderStatus from "../constants/orderStatus";
import { getOrdersByCustomerId } from "../service/restService";
import Error from "../components/Error";
import Nav from "../components/Nav";

const Checkout = () => {
	const { client } = useContext(webSocketContext);

	const location = useLocation();
	const { customer_id } = useParams();
	const locationCart = location?.state?.cart || [];

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("Houve um erro inesperado");

	const [cart, setCart] = useState([]);
	const [paymentType, setPaymentType] = useState(null);
	const [change, setChange] = useState(null);
	const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
	const [observation, setObservation] = useState("");
	const [isObservationFieldOpen, setObservationFieldOpen] = useState(false);

	const [activeOrders, setActiveOrders] = useState(null);

	const loadCustomerOrders = async () => {
		const response = await getOrdersByCustomerId(customer_id);
		if (response?.data) {
			setActiveOrders(response.data);
			setLoading(false);
		} else {
			const errorMessage = "Houve um erro de comunicação com o servidor.";
			console.error(errorMessage);
			setLoading(false);
			setErrorMessage(errorMessage);
			setError(true);
		}
	};

	useEffect(() => {
		setCart(locationCart);
		loadCustomerOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!client) return;

		client.subscribe(endpoints.TOPIC_ORDER, (message) => {
			loadCustomerOrders();
		});

		return () => client.unsubscribe(endpoints.TOPIC_ORDER);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client]);

	const removeFromCart = (item) => {
		const newCart = cart.filter((el) => el.id !== item.id);
		setCart(newCart);
	};

	const handleConfirm = () => {
		alert(
			"Pedido confirmado! Você pode acompanhar o andamento do pedido abaixo."
		);
		setCart([]);

		const serializedOrder = JSON.stringify({
			customerId: customer_id,
			items: cart,
			observation,
		});

		client.publish({
			destination: endpoints.APP_ORDER_ADD,
			body: serializedOrder,
		});
	};

	const handlePaymentSelected = (type) => {
		setPaymentType(type);
		setConfirmButtonDisabled(type !== "cartao");
	};

	const handlePaymentFieldChange = (e) => {
		if (e.target.value.length > 4) {
			e.target.value = e.target.value.slice(0, 4);
			return;
		}

		const payment = isNaN(parseFloat(e.target.value))
			? 0
			: parseFloat(e.target.value) * 100;

		const total = cart
			.map((el) => el.price)
			.reduce((acc, value) => acc + value);

		if (payment < total) {
			setChange(null);
			setConfirmButtonDisabled(true);
			return;
		}

		setConfirmButtonDisabled(false);
		setChange(payment - total);
	};

	const handleOnObservationChange = (e) => {
		setObservation(e.target.value);
	};

	if (loading) return <Loading />;
	if (error) return <Error errorMessage={errorMessage} />;

	return (
		<Fade in={true}>
			<Container maxWidth="md">
				<Nav page="Checkout" title="Checkout" customerId={customer_id} />
				{cart.length > 0 && (
					<>
						<Box sx={{ display: "flex", p: 2 }}>
							<Typography variant="h6">Confirme seu pedido:</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								p: 2,
							}}
						>
							<List dense={true}>
								{cart.map((dish) => (
									<ListItem
										key={dish.id}
										secondaryAction={
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => removeFromCart(dish)}
											>
												<DeleteIcon />
											</IconButton>
										}
									>
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
						</Box>

						<Box sx={{ display: "flex", p: 2 }}>
							<Typography variant="h6">Forma de pagamento:</Typography>
						</Box>

						<Box sx={{ display: "flex", p: 2, ml: 2 }}>
							<RadioGroup
								aria-label="forma_de_pagamento"
								name="cadastro"
								value={paymentType}
								onChange={(e) => handlePaymentSelected(e.target.value)}
								style={{ minWidth: "100%" }}
							>
								<FormControlLabel
									value="cartao"
									control={<Radio color="primary" />}
									label="Cartão"
								/>
								<FormControlLabel
									value="dinheiro"
									control={<Radio color="primary" />}
									label="Dinheiro"
								/>
							</RadioGroup>
						</Box>

						{paymentType === "dinheiro" ? (
							<Box
								sx={{ display: "flex", p: 2, ml: 2, alignItems: "baseline" }}
							>
								<Typography variant="h6" mr={2}>
									R$
								</Typography>

								<TextField
									id="troco"
									label="Troco para"
									variant="standard"
									type="number"
									onChange={handlePaymentFieldChange}
								/>
							</Box>
						) : null}

						<Box sx={{ p: 2 }}>
							{!isObservationFieldOpen ? (
								<Fab
									variant="extended"
									size="small"
									color="primary"
									aria-label="add"
									onClick={() => setObservationFieldOpen(true)}
								>
									<PlusIcon />
									Observação
								</Fab>
							) : (
								<TextField
									id="observation"
									label="Observação para a cozinha"
									variant="standard"
									value={observation}
									onChange={handleOnObservationChange}
								/>
							)}
						</Box>

						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								alignItems: "center",
								justifyContent: "space-between",
								minWidth: "100%",
								p: 2,
								borderRadius: 2,
							}}
						>
							<Box sx={{ display: "flex" }}>
								<Typography variant="h6" mr={2}>
									TOTAL:
								</Typography>
								<Typography variant="h6" color="green">
									{"R$ "}
									{(
										cart
											.map((el) => el.price)
											.reduce((acc, value) => acc + value) / 100
									).toFixed(2)}
								</Typography>
							</Box>

							{change && !isNaN(change) ? (
								<Box sx={{ display: "flex" }}>
									<Typography variant="h6" mr={2}>
										troco:
									</Typography>
									<Typography variant="h6" color="green">
										{"R$ "}
										{(change / 100).toFixed(2)}
									</Typography>
								</Box>
							) : null}

							<Button
								variant="contained"
								onClick={handleConfirm}
								disabled={confirmButtonDisabled}
							>
								confirmar pedido
							</Button>
						</Box>
					</>
				)}

				{activeOrders?.length > 0 && (
					<Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
						<Typography variant="h6">Acompanhar pedidos:</Typography>
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
								{activeOrders.map((order) => (
									<div key={order.id} style={{ margin: "30px 0px 5px 0px" }}>
										<Divider variant="inset" component="li" />
										<ListItem alignItems="flex-start">
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
															<strong>{orderStatus[order.status].name}</strong>
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

export default Checkout;
