import {useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {Accordion, Button, Form, FormGroup, Spinner} from "react-bootstrap";
import {getWorkerToken} from "../../jwtToken.js";

function WorkerTestDetails() {
	const {id} = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [test, setTest] = useState(null);

	useEffect(() => {
		console.log("hujhujhuj")
		getTest();
	}, []);
	const getTest = async () => {
		try {
			const response = await axios.get(`tests/${id}`, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			console.log(response.data);
			setTest(response.data);
			setIsLoading(false);
		}
		catch (error) {
			console.error(error);
		}
	}

	const updateTest = async () => {
		setIsLoading(true);
		try {
			const response = await axios.put(`tests/${id}`, test, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			console.log(response.data);
			await getTest();
		}
		catch (error) {
			console.error(error);
		}
	}

	return isLoading ?
		<Spinner className="spinner-grow"/>
		:
		<>
			<h1>{test.name} ({test.shortName})</h1>
			<Accordion>
				{test.markers.map(m => {
					// napisz kod, który z stworzy listę markerów, składającą się z pól tekstowych i jeśli w tym polu zmodyfikuje się tekst to w useState test zmieni się te pole
					return (
						<Accordion.Item key={m.shortName} eventKey={m.shortName}>
							<Accordion.Header>{m.name}</Accordion.Header>
							<Accordion.Body>
								<FormGroup key={m.shortName}>
									<Form.Label>Nazwa</Form.Label>
									<Form.Control defaultValue={m.name} onChange={r => {
										test.markers.find(x => x.shortName === m.shortName).name = r.target.value;
									}}></Form.Control>
									<Form.Label>Jednostka</Form.Label>
									<Form.Control defaultValue={m.unit} onChange={r => {
										test.markers.find(x => x.shortName === m.shortName).unit = r.target.value;
										console.log(test.markers.find(x => x.shortName === m.shortName))
									}}/>
									<Form.Label>Dolna norma</Form.Label>
									<Form.Control defaultValue={m.lowerNorm} onChange={r => {
										test.markers.find(x => x.shortName === m.shortName).lowerNorm = r.target.value;
									}}/>
									<Form.Label>Górna norma</Form.Label>
									<Form.Control defaultValue={m.higherNorm} onChange={r => {
										test.markers.find(x => x.shortName === m.shortName).higherNorm = r.target.value;
									}}/>
								</FormGroup>
								<Button variant={"danger"} onClick={() => {
									test.markers = test.markers.filter(x => x.shortName !== m.shortName);
									setTest({...test});
								}}>
									Usuń
								</Button>
							</Accordion.Body>
						</Accordion.Item>
					)
				})}
			</Accordion>
			<Button variant="success" onClick={() => {
				test.markers.push({name: "", shortName: "", unit: "", lowerNorm: "", higherNorm: ""});
				setTest({...test});
			}}>Dodaj marker</Button>
			<Button variant="primary" onClick={()=> {
				updateTest();
			}}>Ok</Button>
			<Button variant="danger" onClick={() => {
				setIsLoading(true);
				getTest();
			}}>Wyczyść zmiany</Button>

		</>
}

export default WorkerTestDetails;