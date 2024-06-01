import {getCustomerToken} from "../jwtToken.js";
import axios from "axios";

const customerAxios = axios.create({
	baseURL: 'http://localhost:5002/api'
});

customerAxios.defaults.headers.common['Authorization'] = `Bearer ${getCustomerToken()}`;

customerAxios.interceptors.response.use(response => response,
		error => {
			if(error.response) {
				switch (error.response.status) {
					case 401:
						window.location.href = '/login';
						break;
					case 403:
						window.location.href = '/403';
						break;
					case 404:
						window.location.href = '/404';
						break;
					case 500:
						window.location.href = '/lab/500';
						break;
				}
			}
			return error;
		}
);

export default customerAxios;