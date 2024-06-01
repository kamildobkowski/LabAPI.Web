import {FormGroup, Form, Button, Container} from "react-bootstrap";
import {useState} from "react";
import {saveAs} from "file-saver";
import customerAxios from "../../axios/customerAxios.js";

function CustomerOrder() {
	const [pesel, setPesel] = useState('');
	const [orderNumber, setOrderNumber] = useState('');
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await customerAxios.get(`order/pesel?pesel=${pesel}&orderNumber=${orderNumber}`, { responseType: 'blob' });
			const contentDisposition = response.headers['content-disposition'];
			let fileName = 'downloadedFile';

			if (contentDisposition) {
				console.log(contentDisposition);
				const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
				if (fileNameMatch.length === 2)
					fileName = fileNameMatch[1];
			}

			saveAs(new Blob([response.data], { type: 'application/pdf' }), fileName);
		}
		catch (error) {
			console.error(error);
		}
	}
	return <>
		<Container>
			<h1>Sprawdź swoje wyniki</h1>
			<Form onSubmit={handleSubmit}>
				<FormGroup controlId={"fromBasicNumber"}>
					<Form.Label>Podaj numer zlecenia</Form.Label>
					<Form.Control type="text" placeholder="Wprowadź numer zlecenia" value={orderNumber}
												onChange={e => setOrderNumber(e.target.value)}/>
					<Form.Label>Podaj numer PESEL</Form.Label>
					<Form.Control type="text" placeholder="Wprowadź numer PESEL" value={pesel}
												onChange={e => setPesel(e.target.value)}/>
				</FormGroup>
				<FormGroup controlId={"fromBasicPesel"}>
					<Button variant="primary" type="submit">
						Pobierz
					</Button>
				</FormGroup>
			</Form>
		</Container>
	</>
}

export default CustomerOrder;