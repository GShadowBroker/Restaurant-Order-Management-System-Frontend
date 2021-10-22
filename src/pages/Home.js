import { Container, Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { getAllItems } from "../service/restService";

const Home = () => {
	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		const response = await getAllItems();
		if (response?.data) {
			console.log(response.data);
			setItems(response.data);
		}
	};

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<Container maxWidth="md">
			<Box sx={{ display: "flex" }}>
				<Typography variant="h4">Home</Typography>
			</Box>
		</Container>
	);
};

export default Home;
