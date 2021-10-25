import React, { useEffect, useState } from "react";
import { getOrders } from "../service/restService";
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
import orderStatus from "../constants/orderStatus";

const Cozinha = () => {
	const [loadingOrders, setLoadingOrders] = useState(true);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("Houve um erro inesperado");

	const [orders, setOrders] = useState([]);

	const loadAllOrders = async () => {
		const response = await getOrders();
		if (response?.data) {
			console.log(response.data);
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

	useEffect(() => {
		loadAllOrders();
	}, []);

	const getButtonText = (currentStatus) => {
		switch (currentStatus) {
			case "PENDING":
				return "Marcar na fila";
			case "IN_QUEUE":
				return "Marcar preparando";
			case "PREPARING":
				return "marcar aguardando entrega";
			default:
				return "aguardando entrega";
		}
	};

	if (loadingOrders) return <Loading />;
	if (error) return <Error errorMessage={errorMessage} />;

	return (
		<Fade in={true}>
			<Container maxWidth="md">
				{orders?.length > 0 && (
					<Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
						<Typography variant="h6">Pedidos ativos:</Typography>
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
								{orders.map((order) => (
									<div key={order.id} style={{ margin: "30px 0px 5px 0px" }}>
										<Divider variant="inset" component="li" />
										<ListItem
											alignItems="flex-start"
											secondaryAction={
												<Button>{getButtonText(order.status)}</Button>
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

export default Cozinha;
