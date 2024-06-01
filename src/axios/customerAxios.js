import {getCustomerToken} from "../jwtToken.js";
import axios from "axios";

const customerAxios = axios.create({
	baseURL: 'http://localhost:5002/api',
});

axios.defaults.headers.common['Authorization'] = `Bearer ${getCustomerToken()}`;

export default customerAxios;