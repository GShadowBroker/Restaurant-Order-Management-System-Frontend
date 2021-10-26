import React from "react";
import { Typography, Badge, Button, Paper, Box } from "@material-ui/core";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import { useHistory } from "react-router";

const Cart = ({ cart, activeCustomer }) => {
	const history = useHistory();
	return (
		<Box
			maxWidth="md"
			sx={{
				position: "fixed",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				bottom: 0,
			}}
		>
			<Paper
				sx={{
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "space-between",
					minWidth: "100%",
					p: 2,
					borderRadius: 2,
				}}
				elevation={4}
			>
				<Badge badgeContent={cart.length} color="primary">
					<RestaurantIcon color="action" />
				</Badge>
				<Typography>
					{cart.length > 1
						? `${cart.length} pratos selecionados`
						: "1 prato selecionado"}
				</Typography>
				<Typography>
					total:{" R$ "}
					{(
						cart.map((el) => el.price).reduce((acc, value) => acc + value) / 100
					).toFixed(2)}
				</Typography>
				<Button
					onClick={() =>
						history.push(`/checkout/${activeCustomer.id}`, { cart })
					}
				>
					fazer pedido
				</Button>
			</Paper>
		</Box>
	);
};

export default Cart;
