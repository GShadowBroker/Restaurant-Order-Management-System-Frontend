import {
	Container,
	Typography,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardHeader,
	Avatar,
	Badge,
	Button,
	Paper,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { green } from "@material-ui/core/colors";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import CheckIcon from "@material-ui/icons/Check";

import React, { useEffect, useState } from "react";
import { getSomeItems, getCustomers } from "../service/restService";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useHistory } from "react-router";

const Home = () => {
	const history = useHistory();
	const [loadingItems, setLoadingItems] = useState(true);
	const [loadingCustomers, setLoadingCustomers] = useState(true);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("Houve um erro inesperado");

	const [customers, setCustomers] = useState([]);
	const [activeCustomer, setActiveCustomer] = useState(null);
	const [recommendedItems, setRecommendedItems] = useState([]);
	const [cart, setCart] = useState([]);

	const fetchRecommendedItems = async () => {
		const response = await getSomeItems(5, 0);
		if (response?.data) {
			console.log(response.data);
			setRecommendedItems(response.data);
			setLoadingItems(false);
		} else {
			const errorMessage = "Houve um erro de comunicação com o servidor.";
			console.error(errorMessage);
			setLoadingItems(false);
			setErrorMessage(errorMessage);
			setError(true);
		}
	};

	const fetchCustomers = async () => {
		const response = await getCustomers(3, 0);
		if (response?.data) {
			console.log(response.data);
			setCustomers(response.data);
			setActiveCustomer(response.data[0]);
			setLoadingCustomers(false);
		} else {
			const errorMessage = "Houve um erro de comunicação com o servidor.";
			console.error(errorMessage);
			setLoadingCustomers(false);
			setErrorMessage(errorMessage);
			setError(true);
		}
	};

	useEffect(() => {
		fetchCustomers();
		fetchRecommendedItems();
	}, []);

	const addToCart = (item) => {
		console.log(`Adding ${item.name} to cart...`);
		setCart([...cart, item]);
	};

	const removeFromCart = (item) => {
		console.log(`Removing ${item.name} from cart...`);
		const newCart = cart.filter((el) => el.id !== item.id);
		setCart(newCart);
	};

	const isItemInCart = (item) => {
		return cart.indexOf(item) > -1;
	};

	const toggleItemSelect = (item) => {
		if (isItemInCart(item)) {
			removeFromCart(item);
		} else {
			addToCart(item);
		}
	};

	if (loadingItems || loadingCustomers) return <Loading />;
	if (error) return <Error errorMessage={errorMessage} />;

	return (
		<Container maxWidth="md">
			<Box sx={{ display: "flex", p: 2 }}>
				<Typography variant="body2">
					Bem vindo(a), {activeCustomer.firstName}
				</Typography>
			</Box>
			<Box sx={{ display: "flex", p: 2 }}>
				<Typography variant="h4">Restaurante Orgulho do Leão</Typography>
			</Box>
			<Box sx={{ display: "flex", p: 2 }}>
				<Typography variant="h4">Pratos recomendados</Typography>
			</Box>

			<Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
				{recommendedItems.map((dish) => (
					<Card
						sx={{
							width: 240,
							m: 2,
							backgroundColor: isItemInCart(dish) ? "#7bed9f" : "white",
						}}
						key={dish.id}
					>
						<CardActionArea onClick={() => toggleItemSelect(dish)}>
							<CardHeader
								avatar={
									isItemInCart(dish) ? (
										<Avatar sx={{ bgcolor: green[500] }} aria-label={dish.name}>
											<CheckIcon />
										</Avatar>
									) : null
								}
								subheader={`R$ ${(dish.price / 100).toFixed(2)}`}
							/>

							<CardMedia
								component="img"
								image={dish.imageUrl}
								alt={dish.name}
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									{dish.name}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{dish.description}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				))}
			</Box>
			{cart?.length > 0 && (
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
								cart.map((el) => el.price).reduce((acc, value) => acc + value) /
								100
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
			)}
		</Container>
	);
};

export default Home;
