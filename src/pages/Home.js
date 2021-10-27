import {
	Container,
	Typography,
	Button,
	Fade,
	TextField,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import SearchIcon from "@material-ui/icons/Search";

import React, { useEffect, useState } from "react";
import {
	getSomeItems,
	getCustomers,
	searchItems,
} from "../service/restService";
import Loading from "../components/Loading";
import Error from "../components/Error";
import ItemList from "../components/ItemList";
import Cart from "../components/Cart";
import Nav from "../components/Nav";

const Home = () => {
	const [loadingItems, setLoadingItems] = useState(true);
	const [loadingCustomers, setLoadingCustomers] = useState(true);
	const [loadingSearchItems, setLoadingSearchItems] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("Houve um erro inesperado");

	const [customers, setCustomers] = useState([]);
	const [activeCustomer, setActiveCustomer] = useState(null);
	const [recommendedItems, setRecommendedItems] = useState([]);
	const [cart, setCart] = useState([]);
	const [searchedItems, setSearchedItems] = useState([]);
	const [searchUsed, setSearchUsed] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");

	const fetchRecommendedItems = async () => {
		const response = await getSomeItems(5, 0);
		if (response?.data) {
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

	const fetchItems = async (term) => {
		setLoadingSearchItems(true);
		const response = await searchItems(term);
		if (response?.data) {
			setSearchedItems(response.data);
		} else {
			const errorMessage = "Houve um erro de comunicação com o servidor.";
			console.error(errorMessage);
			setErrorMessage(errorMessage);
			setError(true);
		}
		setLoadingSearchItems(false);
		setSearchUsed(true);
	};

	useEffect(() => {
		fetchCustomers();
		fetchRecommendedItems();
	}, []);

	const addToCart = (item) => {
		setCart([...cart, item]);
	};

	const removeFromCart = (item) => {
		const newCart = cart.filter((el) => el.id !== item.id);
		setCart(newCart);
	};

	const isItemInCart = (item) => {
		return cart.map((el) => el.id).indexOf(item.id) > -1;
	};

	const toggleItemSelect = (item) => {
		if (isItemInCart(item)) {
			removeFromCart(item);
		} else {
			addToCart(item);
		}
	};

	const onChangeSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const onSubmitSearch = (e) => {
		e.preventDefault();

		if (!searchTerm.trim()) return;

		fetchItems(searchTerm.trim());
		setSearchTerm("");
	};

	if (loadingItems || loadingCustomers) return <Loading />;
	if (error) return <Error errorMessage={errorMessage} />;

	console.log("customers", JSON.stringify(customers, null, 2));

	return (
		<Fade in={true}>
			<Container maxWidth="md" sx={{ mb: 15 }}>
				<Nav
					page="Home"
					title={`Bem vindo(a), ${activeCustomer.firstName}!`}
					customerId={activeCustomer.id}
				/>
				<Box sx={{ display: "flex", p: 2 }}>
					<Typography variant="h4">Restaurante Orgulho do Leão</Typography>
				</Box>

				<Box sx={{ my: 5 }}>
					<form
						onSubmit={onSubmitSearch}
						style={{
							display: "flex",
							alignItems: "flex-end",
							flexWrap: "wrap",
						}}
					>
						<SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
						<TextField
							id="search"
							label="Buscar por nome ou código"
							variant="standard"
							sx={{ width: 300 }}
							value={searchTerm}
							onChange={onChangeSearch}
						/>
						<Button
							type="submit"
							variant="outlined"
							sx={{ ml: 5, marginTop: 2 }}
						>
							Buscar prato
						</Button>
					</form>
				</Box>

				{loadingSearchItems && <Loading />}

				{searchedItems?.length > 0 && (
					<>
						<Box sx={{ display: "flex", p: 2 }}>
							<Typography variant="h4">
								Resultados ({searchedItems.length}):
							</Typography>
						</Box>
						<ItemList
							items={searchedItems}
							isItemInCart={isItemInCart}
							toggleItemSelect={toggleItemSelect}
						/>
					</>
				)}

				{searchUsed && searchedItems?.length === 0 ? (
					<Box sx={{ display: "flex", p: 2 }}>
						<Typography variant="body1">Nenhum resultado encontrado</Typography>
					</Box>
				) : null}

				<Box sx={{ display: "flex", p: 2 }}>
					<Typography variant="h4">Pratos recomendados</Typography>
				</Box>

				<ItemList
					items={recommendedItems}
					isItemInCart={isItemInCart}
					toggleItemSelect={toggleItemSelect}
				/>

				{cart?.length > 0 && (
					<Cart cart={cart} activeCustomer={activeCustomer} />
				)}
			</Container>
		</Fade>
	);
};

export default Home;
