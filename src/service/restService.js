import axios from "axios";
import endpoints from "../constants/endpoints";

export const getAllItems = () => {
	return axios.get(`${endpoints.BASE_REST_URL}/item`);
};

export const getSomeItems = (limit, offset) => {
	return axios.get(`${endpoints.BASE_REST_URL}/item/some`, {
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

export const getOrders = () => {
	return axios.get(`${endpoints.BASE_REST_URL}/order`);
};

export const getOrdersByCustomerId = (customerId, limit, offset) => {
	return axios.get(`${endpoints.BASE_REST_URL}/customer/${customerId}/order`, {
		params: {
			limit,
			offset,
		},
	});
};
