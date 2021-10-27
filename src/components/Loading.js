import { Container, CircularProgress } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React from "react";

const Loading = () => {
	return (
		<Container maxWidth="md">
			<Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
				<CircularProgress />
			</Box>
		</Container>
	);
};

export default Loading;
