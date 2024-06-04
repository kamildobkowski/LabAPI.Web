import {Alert, Button, Container, Form, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import workerAxios from "../../axios/workerAxios.js";
import {loginWorker} from "../../jwtToken.js";

function WorkerLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const [authorizationErrorMessage] = useState(queryParams.get('errorMessage') ?? null);
	const [loginErrors, setLoginErrors] = useState({});

	const validateLogin = () => {
		let errorList = {};
		if(!email) {
			errorList.email = 'Email jest wymagany';
		}
		if(!password) {
			errorList.password = 'Hasło jest wymagane';
		}
		setLoginErrors({...errorList});
		return Object.keys(errorList).length === 0;
	}

	const handleSubmitLogin = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		const validate = validateLogin();
		if(!validate) {
			setIsLoading(false);
			return;
		}
		const response = await workerAxios.post('worker/login', {email, password});
		const code = response.response?.status;
		if(!code) {
				loginWorker(response.data);
				window.location.href = '/lab';
		}
		else {
				window.location.href = '/lab/login?errorMessage=InvalidLoginOrPassword';
		}
	}

	useEffect(() => {
		console.log(authorizationErrorMessage);
	}, [authorizationErrorMessage]);


	return (
		<Container>
			<h2>Logowanie pracownika</h2>
			<Alert variant="danger" show={authorizationErrorMessage !== null}>
				{errorMessage(authorizationErrorMessage)}
			</Alert>
			<Form onSubmit={handleSubmitLogin}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" placeholder="Wprowadź email" value={email}
												onChange={e => setEmail(e.target.value)}
												isInvalid={!!loginErrors.email}/>
					<Form.Control.Feedback type="invalid" hidden={!loginErrors.email}>{loginErrors.email}</Form.Control.Feedback>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Hasło</Form.Label>
					<Form.Control type="password" placeholder="Hasło" value={password}
												onChange={e => setPassword(e.target.value)}
												isInvalid={!!loginErrors.password}/>
					<Form.Control.Feedback type="invalid" hidden={!loginErrors.password}>{loginErrors.password}</Form.Control.Feedback>
				</Form.Group>

				<Button variant="primary" type="submit">
					{isLoading ? <Spinner animation="grow" size="sm"/> : "Zaloguj się"}
				</Button>
			</Form>
		</Container>
	)
}

const errorMessage = (errorParam) => {
	switch(errorParam) {
		case 'InvalidLoginOrPassword':
			return 'Nieprawidłowy login i/lub hasło'
		default:
			return 'Wymagane zalogowanie'
	}
}

export default WorkerLogin;