import {useEffect, useState} from "react";
import * as jwtToken from "../../jwtToken.js";
import workerAxios from "../../axios/workerAxios.js";
import customerAxios from "../../axios/customerAxios.js";
import {Alert, Button, Form} from "react-bootstrap";

// eslint-disable-next-line react/prop-types
function ResetPassword({isWorker}) {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [isWrongData, setIsWrongData] = useState(false);

	useEffect(() => {
		if(isWorker) {
			if(!jwtToken.isWorkerLogger()) {
				window.location.href = "/lab/login";
			}
		}
		else {
			if(!jwtToken.isCustomerLogger()) {
				window.location.href = "/login";
			}
		}
	}, []);
	useEffect(() => {

	}, [errors]);

	const validate = () => {
		let errorList = {};
		if(!oldPassword) {
			errorList.oldPassword = "Stare hasło jest wymagane";
		}
		if(!newPassword) {
			errorList.newPassword = "Nowe hasło jest wymagane";
		}
		if(!repeatPassword) {
			errorList.repeatPassword = "Powtórzenie nowego hasła jest wymagane";
		}
		if(newPassword !== repeatPassword) {
			errorList.repeatPassword = "Nowe hasła nie są takie same";
		}
		setErrors({...errorList});
		return Object.keys(errorList).length === 0;
	}

	const handleSubmit = async () => {
		const isValid = validate();
		if(!isValid) {
			return;
		}
		if(isWorker) {
			const response = await workerAxios.patch("/worker/changePassword", {
				oldPassword: oldPassword,
				newPassword: newPassword,
				repeatPassword: repeatPassword,
				email: jwtToken.getWorkerEmail()
			})
			const code = response.response?.status;
			if(!code) {
				jwtToken.logoutWorker();
				window.location.href = "/lab/login";
			}
			else {
				setIsWrongData(true);
				setOldPassword("");
				setNewPassword("");
				setRepeatPassword("");
			}
		}
		else {
			const response = await customerAxios.patch("/customer/changePassword", {
				oldPassword: oldPassword,
				newPassword: newPassword,
				repeatPassword: repeatPassword,
				email: jwtToken.getWorkerEmail()
			})
			const code = response.response?.status;
			if(!code) {
				jwtToken.logoutCustomer();
				window.location.href = "/lab/login";
			}
			else {
				setIsWrongData(true);
				setOldPassword("");
				setNewPassword("");
				setRepeatPassword("");
			}
	}}

	return (
			<div>
					<h1>Zmień hasło</h1>
					<Form>
						<Alert variant="danger" show={isWrongData}>Błędne dane</Alert>
							<Form.Label>Podaj stare hasło</Form.Label>
							<Form.Control value={oldPassword} onChange=
								{(e)=> {
									e.stopPropagation();
									setOldPassword(e.target.value)
								}} type="password" isInvalid={!!errors.oldPassword}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.oldPassword}>{errors.oldPassword}</Form.Control.Feedback>
							<Form.Label>Podaj nowe hasło</Form.Label>
							<Form.Control value={newPassword} onChange=
								{(e)=> {
									e.stopPropagation();
									setNewPassword(e.target.value)
								}} type="password" isInvalid={!!errors.newPassword}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.newPassword}>{errors.newPassword}</Form.Control.Feedback>
							<Form.Label>Powtórz nowe hasło</Form.Label>
							<Form.Control value={repeatPassword} onChange=
								{(e)=> {
									e.stopPropagation();
									setRepeatPassword(e.target.value)
								}} type="password" isInvalid={!!errors.repeatPassword}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.repeatPassword}>{errors.repeatPassword}</Form.Control.Feedback>
							<Button onClick={handleSubmit}>Zmień hasło</Button>
					</Form>
			</div>
		);
}

export default ResetPassword;