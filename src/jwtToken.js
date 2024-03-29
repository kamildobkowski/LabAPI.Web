import * as jwtDecode from 'jwt-decode';

export const isCustomerLogger = () => {
	const token = localStorage.getItem('token');
	return !!token;
}

export const getWorkerRole = () => {
	const token = localStorage.getItem('workerToken');
	if(token) {
		const decoded = jwtDecode.jwtDecode(token);
		console.log(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
	}
	return null;
}

export const getWorkerEmail = () => {
	const token = localStorage.getItem('workerToken');
	if(token) {
		const decoded = jwtDecode.jwtDecode(token);
		console.log(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
	}
	return null;
}
export const getCustomerEmail = () => {
	const token = localStorage.getItem('token');
	if(token) {
		const decoded = jwtDecode.jwtDecode(token);
		console.log(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
	}
	return null;
}

export const getCustomerName = () => {
	const token = localStorage.getItem('token');
	if(token) {
		const decoded = jwtDecode.jwtDecode(token);
		console.log(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
	}
	return null;
}
export const getWorkerName = () => {
	const token = localStorage.getItem('workerToken');
	if(token) {
		const decoded = jwtDecode.jwtDecode(token);
		console.log(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
	}
	return null;
}
export const getCustomerPesel = () => {
	const token = localStorage.getItem('token');
	if(token) {
		const decoded = jwtDecode.jwtDecode(token);
		console.log(decoded['Pesel']);
	}
	return null;
}
