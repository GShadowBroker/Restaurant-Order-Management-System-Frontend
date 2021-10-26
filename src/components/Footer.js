import React from "react";
import { Box, Typography } from "@material-ui/core";

const Footer = () => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				my: 5,
				width: "100%",
			}}
		>
			<Typography variant="body1" component="span" color="text.secondary">
				&copy; {new Date().getFullYear()} - Gledyson Ferreira
			</Typography>
		</Box>
	);
};

export default Footer;
