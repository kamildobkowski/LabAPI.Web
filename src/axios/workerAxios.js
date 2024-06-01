import {getWorkerToken} from "../jwtToken.js";
import axios from "axios";

const workerAxios = axios.create({
	baseURL: 'http://localhost:5002/api'
});

workerAxios.defaults.headers.common['Authorization'] = `Bearer ${getWorkerToken()}`;

export default workerAxios;