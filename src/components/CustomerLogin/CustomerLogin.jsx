import {useEffect, useState} from 'react';
import {Container, Form, Button, Spinner, Alert} from 'react-bootstrap';
import {loginCustomer} from "../../jwtToken.js";
import customerAxios from "../../axios/customerAxios.js";
import {useLocation} from "react-router-dom";

function CustomerLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [register, setRegister] = useState(false);
	const [repeatPassword, setRepeatPassword] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [pesel, setPesel] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const [authorizationErrorMessage] = useState(queryParams.get('errorMessage') ?? null);
	const [errors, setErrors] = useState({});
	const [loginErrors, setLoginErrors] = useState({});

	useEffect(() => {

	}, [errors, register]);

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
		const response = await customerAxios.post('customer/login', {email, password});
		const code = response.response?.status;
		if(!code) {
			loginCustomer(response.data);
			window.location.href = '/';
		}
		else {
			window.location.href = '/login?errorMessage=InvalidLoginOrPassword';
		}
	};
	const validateRegister = () => {
		let errorList = {};
		if(!email) {
			errorList.email = 'Email jest wymagany';
		}
		if(!password) {
			errorList.password = 'Hasło jest wymagane';
		}
		else {
			const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
			if(!regex.test(password)) {
				errorList.password = 'Hasło musi zawierać 8 znaków, jedną wielką literę i jedną cyfrę';
			}
		}
		if(password !== repeatPassword) {
			errorList.repeatPassword = 'Hasła muszą być takie same';
		}
		if(!name) {
			errorList.name = 'Imie jest wymagane';
		}
		if(!surname) {
			errorList.surname = 'Nazwisko jest wymagane';
		}
		if(!pesel) {
			errorList.pesel = 'PESEL jest wymagany';
		}
		else {
			const regex = /^[0-9]{11}$/;
			if(!regex.test(pesel)) {
				errorList.pesel = 'PESEL musi zawierać 11 cyfr';
			}
		}

		setErrors({...errorList});
		return Object.keys(errorList).length === 0;
	}
	const handleSubmitRegister = async (event) => {
		event.preventDefault();
		setIsLoading(true)
		const validate = validateRegister();
		console.log(validate)
		if(!validate) {
			setIsLoading(false);
			return;
		}
		let model = {
			email: email,
			password: password,
			repeatPassword: repeatPassword,
			name: name,
			surname: surname,
			pesel: pesel
		}

		try {
				const response = await customerAxios.post('customer/register', model);
				console.log(response.data);
				setRegister(false);
				if(response.status === 200) {
					setRegister(false)
				}
				else {
					console.log(response)
				}
			} catch (error) {
				console.error(error);
			}
			setIsLoading(false);
	}
	if (register) {
		return (
			<Container>
				<h2>Rejestracja użytkownika</h2>
				<Form onSubmit={handleSubmitRegister}>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Wprowadź email" value={email}
													onChange={e => setEmail(e.target.value)}
													isInvalid={!!errors.email}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.email}>{errors.email}</Form.Control.Feedback>
						<Form.Label>Hasło</Form.Label>
						<Form.Control type="password" placeholder="Hasło" value={password}
													onChange={e => setPassword(e.target.value)}
													isInvalid={!!errors.password}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.password}>{errors.password}</Form.Control.Feedback>
						<Form.Label>Powtórz hasło</Form.Label>
						<Form.Control type="password" placeholder="Powtórz hasło" value={repeatPassword}
													onChange={e => setRepeatPassword(e.target.value)}
													isInvalid={!!errors.repeatPassword}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.repeatPassword}>{errors.repeatPassword}</Form.Control.Feedback>
						<Form.Label>Imie</Form.Label>
						<Form.Control type="text" placeholder="Imie" value={name}
													onChange={e => setName(e.target.value)}
													isInvalid={!!errors.name}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.name}>{errors.name}</Form.Control.Feedback>
						<Form.Label>Nazwisko</Form.Label>
						<Form.Control type="text" placeholder="Nazwisko" value={surname}
													onChange={e => setSurname(e.target.value)}
													isInvalid={!!errors.surname}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.surname}>{errors.surname}</Form.Control.Feedback>
						<Form.Label>PESEL</Form.Label>
						<Form.Control type="text" placeholder="PESEL" value={pesel}
													onChange={e => setPesel(e.target.value)}
													isInvalid={!!errors.pesel}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.pesel}>{errors.pesel}</Form.Control.Feedback>
					</Form.Group>
					<Button variant="primary" type="submit">
						{isLoading ? <Spinner animation="grow" size="sm"/> : "Zarejestruj się"}
					</Button>
				</Form>
				<Button variant="secondary" onClick={() => {
					setRegister(false);
					setPassword('');
					setSurname('');
					setName('');
					setPesel('');
					setRepeatPassword('');
				}}>
					Masz już konto? Zaloguj się
				</Button>
			</Container>
		)
	} else {
		return (
			<Container>
				<h2>Logowanie użytkownika</h2>
				<Alert variant="danger" show={!!authorizationErrorMessage}>{errorMessage(authorizationErrorMessage)}</Alert>
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
				<Button variant="secondary" onClick={() => {
					setRegister(true);
					setPassword('');
					setSurname('');
					setName('');
					setPesel('');
					setRepeatPassword('');
				}}>
					Nie masz konta? Zarejestruj się
				</Button>
			</Container>
		);
	}
}
const errorMessage = (errorParam) => {
	switch(errorParam) {
		case 'InvalidLoginOrPassword':
			return 'Nieprawidłowy login i/lub hasło'
		default:
			return 'Wymagane zalogowanie'
	}
}

export default CustomerLogin;