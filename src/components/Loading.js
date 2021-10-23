import { Container, Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React from "react";

const Loading = () => {
	return (
		<Container maxWidth="md">
			<Box sx={{ display: "flex" }}>
				<Typography variant="h4">Carregando...</Typography>
			</Box>
		</Container>
	);
};

export default Loading;
