import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function CustomerLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post('http://localhost:5116/api/customer/login', { email, password });
			console.log(response.data);
			localStorage.setItem('token', response.data)
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Container>
			<h2>Logowanie użytkownika</h2>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" placeholder="Wprowadź email" value={email} onChange={e => setEmail(e.target.value)} />
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Hasło</Form.Label>
					<Form.Control type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
				</Form.Group>

				<Button variant="primary" type="submit">
					Zaloguj się
				</Button>
			</Form>
		</Container>
	);
}

export default CustomerLogin;