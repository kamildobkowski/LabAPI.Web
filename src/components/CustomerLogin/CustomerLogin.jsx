import {useEffect, useState} from 'react';
import {Container, Form, Button, Spinner} from 'react-bootstrap';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function CustomerLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [register, setRegister] = useState(false);
	const [repeatPassword, setRepeatPassword] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [pesel, setPesel] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {

	}, [register]);

	const handleSubmitLogin = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			const response = await axios.post('customer/login', {email, password});
			console.log(response.data);
			localStorage.setItem('token', response.data)
			navigate('/');
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};
	const handleSubmitRegister = async (event) => {
		event.preventDefault();
		setIsLoading(true)
		let model = {
			email: email,
			password: password,
			repeatPassword: repeatPassword,
			name: name,
			surname: surname,
			pesel: pesel
		}
	try {
				const response = await axios.post('customer/register', model);
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
													onChange={e => setEmail(e.target.value)}/>
						<Form.Label>Hasło</Form.Label>
						<Form.Control type="password" placeholder="Hasło" value={password}
													onChange={e => setPassword(e.target.value)}/>
						<Form.Label>Powtórz hasło</Form.Label>
						<Form.Control type="password" placeholder="Powtórz hasło" value={repeatPassword}
													onChange={e => setRepeatPassword(e.target.value)}/>
						<Form.Label>Imie</Form.Label>
						<Form.Control type="text" placeholder="Imie" value={name}
													onChange={e => setName(e.target.value)}/>
						<Form.Label>Nazwisko</Form.Label>
						<Form.Control type="text" placeholder="Nazwisko" value={surname}
													onChange={e => setSurname(e.target.value)}/>
						<Form.Label>PESEL</Form.Label>
						<Form.Control type="text" placeholder="PESEL" value={pesel}
													onChange={e => setPesel(e.target.value)}/>
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
				<Form onSubmit={handleSubmitLogin}>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Wprowadź email" value={email}
													onChange={e => setEmail(e.target.value)}/>
					</Form.Group>

					<Form.Group controlId="formBasicPassword">
						<Form.Label>Hasło</Form.Label>
						<Form.Control type="password" placeholder="Hasło" value={password}
													onChange={e => setPassword(e.target.value)}/>
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

export default CustomerLogin;