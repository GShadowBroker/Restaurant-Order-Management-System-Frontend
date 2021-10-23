import axios from "axios";
import endpoints from "../constants/endpoints";

export const getAllItems = () => {
	return axios.get(`${endpoints.BASE_REST_URL}/order/items`);
};

export const getSomeItems = (limit, offset) => {
	return axios.get(`${endpoints.BASE_REST_URL}/order/items/some`, {
		params: {
			limit,
			offset,
		},
	});
};

export const getCustomers = (limit, offset) => {
	return axios.get(`${endpoints.BASE_REST_URL}/customer`, {
		params: {
			limit,
			offset,
		},
	});
};
