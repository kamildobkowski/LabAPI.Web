import {useState} from "react";
import EditTestMarker from "../EditTestMarker/EditTestMarker.jsx";
import {Button, Form, FormGroup, Spinner} from "react-bootstrap";
import {getWorkerToken} from "../../jwtToken.js";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function WorkerAddTest() {
	const [test, setTest] = useState({ markers: [] });
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const addTest = async () => {
		try {
			setIsLoading(true);
			await axios.post("tests", test, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			setIsLoading(false);
			navigate("/lab/test");
		}
		catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<h1>Dodaj nowy test</h1>
			<FormGroup>
				<Form.Label>
					<h2>Nazwa</h2>
				</Form.Label>
				<Form.Control value={test.name} onChange={(e) => setTest({...test, name: e.target.value})}/>
				<Form.Label>
					<h2>Skrót</h2>
				</Form.Label>
				<Form.Control value={test.shortName} onChange={(e) => setTest({...test, shortName: e.target.value})}/>
			</FormGroup>
			<h2>Markery</h2>
			<EditTestMarker test={test} setTest={setTest}/>
			{
				isLoading ?
				<Spinner animation="border" role="status"/>
				:
				<Button variant="primary" onClick={()=> addTest()}>
					Dodaj
				</Button>
				}
		</>
	)
}

export default WorkerAddTest;