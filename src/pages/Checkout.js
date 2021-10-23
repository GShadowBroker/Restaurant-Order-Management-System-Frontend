import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import {
	List,
	ListItem,
	Avatar,
	ListItemAvatar,
	ListItemText,
	IconButton,
	Container,
	Typography,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	TextField,
} from "@material-ui/core";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import DeleteIcon from "@material-ui/icons/Delete";
import { Box } from "@material-ui/system";
import Loading from "../components/Loading";

const Checkout = () => {
	const location = useLocation();
	const { customer_id } = useParams();
	const locationCart = location.state.cart || [];

	const [loading, setLoading] = useState(true);
	const [cart, setCart] = useState([]);
	const [paymentSelected, setPaymentSelected] = useState(false);
	const [paymentType, setPaymentType] = useState(null);
	const [payment, setPayment] = useState(0);
	const [change, setChange] = useState(null);
	const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);

	useEffect(() => {
		setCart(locationCart);
		setLoading(false);
	}, []);

	const removeFromCart = (item) => {
		console.log(`Removing ${item.name} from cart...`);
		const newCart = cart.filter((el) => el.id !== item.id);
		setCart(newCart);
	};

	const handleConfirm = () => {
		// TODO make request to server
		alert(
			"Pedido confirmado! Você pode acompanhar o andamento do pedido abaixo."
		);
		setCart([]);
	};

	const handlePaymentSelected = (type) => {
		setPaymentType(type);
		setPaymentSelected(true);

		if (type === "cartao") {
			setConfirmButtonDisabled(false);
		} else {
			setConfirmButtonDisabled(true);
		}
	};

	const handlePaymentFieldChange = (e) => {
		if (e.target.value.length > 4) {
			e.target.value = e.target.value.slice(0, 4);
			return;
		}

		const payment = isNaN(parseFloat(e.target.value))
			? 0
			: parseFloat(e.target.value) * 100;

		setPayment(payment);

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

	if (loading) return <Loading />;

	return (
		<Container maxWidth="md">
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
						{cart.map((dish) => (
							<List dense={true} key={dish.id}>
								<ListItem
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
										<Avatar>
											<RestaurantIcon />
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={dish.name}
										secondary={`R$ ${(dish.price / 100).toFixed(2)}`}
									/>
								</ListItem>
							</List>
						))}
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
						<Box sx={{ display: "flex", p: 2, ml: 2, alignItems: "baseline" }}>
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

			<Box sx={{ display: "flex", p: 2 }}>
				<Typography variant="h6">Acompanhar pedidos:</Typography>
			</Box>
		</Container>
	);
};

export default Checkout;
