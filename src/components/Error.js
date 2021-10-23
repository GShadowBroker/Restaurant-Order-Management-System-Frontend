import React from "react";
import { Container, Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";

const Error = ({ errorMessage }) => {
	return (
		<Container maxWidth="md">
			<Box sx={{ display: "flex" }}>
				<Typography variant="h4">{errorMessage}</Typography>
			</Box>
		</Container>
	);
};

export default Error;
