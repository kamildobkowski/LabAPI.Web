import {Button, Container, Form, Spinner} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import workerAxios from "../../axios/workerAxios.js";

function WorkerLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmitLogin = async (event) => {
		event.preventDefault()

		setIsLoading(true);
		try {
			console.log(email, password);
			const response = await workerAxios.post('worker/login', {email, password});
			console.log(response.data)
			localStorage.setItem('workerToken', response.data);
			navigate('/lab');
		}
		catch(error) {
			console.error(error);
		}
		setIsLoading(false);
	}


	return (
		<Container>
			<h2>Logowanie pracownika</h2>
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
		</Container>
	)
}

export default WorkerLogin;