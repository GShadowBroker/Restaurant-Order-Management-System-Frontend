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

export const updateStatus = (orderId, newStatus) => {
	return axios.put(
		`${endpoints.BASE_REST_URL}/order/${orderId}?status=${newStatus}`
	);
};

export const removeOrder = (orderId) => {
	return axios.delete(`${endpoints.BASE_REST_URL}/order/${orderId}`);
};

export const searchItems = (searchTerm, limit = 10, offset = 0) => {
	return axios.get(
		`${endpoints.BASE_REST_URL}/item/search?term=${searchTerm}&limit=${limit}&offset=${offset}`
	);
};
