import React from "react";
import { ButtonGroup, Button, Box, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Nav = ({ page: currentPageName, title, customerId }) => {
	const history = useHistory();

	const pageNames = [
		{
			name: "Home",
			path: "/",
		},
		{
			name: "Checkout",
			path: `/checkout/${customerId}`,
		},
		{
			name: "Cozinha",
			path: "/cozinha",
		},
		{
			name: "Garçom",
			path: "/garcom",
		},
	];

	const handleButtonClick = (url) => {
		if (!url) return;
		history.push(url);
	};

	const renderButtons = () => {
		return pageNames.map((el) => {
			if (
				el.name === "Checkout" &&
				history.location.pathname !== "/" &&
				!history.location.pathname.startsWith("/checkout")
			)
				return null;
			return (
				<Button
					variant={el.name === currentPageName ? "contained" : "outlined"}
					onClick={() => handleButtonClick(el.path)}
					key={el.name}
				>
					{el.name}
				</Button>
			);
		});
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexWrap: "wrap",
				p: 2,
			}}
		>
			<Typography variant="body2" component="div">
				<strong>{title}</strong>
			</Typography>
			<ButtonGroup aria-label="botões de navegação">
				{renderButtons()}
			</ButtonGroup>
		</Box>
	);
};

export default Nav;
