import {getWorkerToken} from "../jwtToken.js";
import axios from "axios";

const workerAxios = axios.create({
	baseURL: 'http://localhost:5002/api'
});

workerAxios.defaults.headers.common['Authorization'] = `Bearer ${getWorkerToken()}`;

workerAxios.interceptors.response.use(response => response,
	error => {
		if(error.response) {
			switch (error.response.status) {
				case 401:
					window.location.href = '/lab/login';
					break;
				case 403:
					window.location.href = '/lab/403';
					break;
				case 404:
					window.location.href = '/lab/404';
					break;
				case 500:
					window.location.href = '/lab/500';
					break;
			}
		}
		return error;
	}
);

export default workerAxios;