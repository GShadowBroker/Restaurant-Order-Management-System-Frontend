import axios from "axios";
import endpoints from "../constants/endpoints";

export const getAllItems = () => {
	return axios.get(`${endpoints.BASE_REST_URL}/order/items`);
};
