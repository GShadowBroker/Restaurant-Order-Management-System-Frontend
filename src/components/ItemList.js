import React from "react";
import {
	Typography,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardHeader,
	Avatar,
	Box,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import CheckIcon from "@material-ui/icons/Check";

const ItemList = ({ items, isItemInCart, toggleItemSelect }) => {
	return (
		<Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
			{items.map((dish) => (
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

						<CardMedia component="img" image={dish.imageUrl} alt={dish.name} />
						<CardContent>
							<Typography gutterBottom variant="h5" component="div">
								{dish.name}
							</Typography>
							<Typography
								gutterBottom
								variant="body2"
								component="div"
								color="text.secondary"
								textAlign="right"
								sx={{ marginBottom: 3 }}
							>
								({dish.code})
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{dish.description}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			))}
		</Box>
	);
};

export default ItemList;
