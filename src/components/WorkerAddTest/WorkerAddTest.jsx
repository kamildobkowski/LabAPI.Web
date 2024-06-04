import {useEffect, useState} from "react";
import EditTestMarker from "../EditTestMarker/EditTestMarker.jsx";
import {Button, Form, FormGroup, Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import workerAxios from "../../axios/workerAxios.js";

function WorkerAddTest() {
	const [test, setTest] = useState({ markers: [] });
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});

	const addTest = async () => {
			setIsLoading(true);
			const isValid = validateTest()
			if(!isValid) {
				setIsLoading(false);
				return;
			}
			await workerAxios.post("tests", test);
			setIsLoading(false);
			navigate("/lab/test");
	}

	const validateTest = () => {
		let errorList = {};
		if(!test.name) {
			errorList.name = 'Nazwa jest wymagana';
		}
		if(!test.shortName) {
			errorList.shortName = 'Skrót jest wymagany';
		}
		setErrors({...errorList});
		return Object.keys(errorList).length === 0;
	}

	return (
		<>
			<h1>Dodaj nowy test</h1>
			<FormGroup>
				<Form.Label>
					<h5>Nazwa</h5>
				</Form.Label>
				<Form.Control value={test.name} onChange={(e) => setTest({...test, name: e.target.value})} isInvalid={!!errors.name}/>
				<Form.Label>
					<h5>Skrót</h5>
				</Form.Label>
				<Form.Control value={test.shortName} onChange={(e) => setTest({...test, shortName: e.target.value})} isInvalid={!!errors.shortName}/>
			</FormGroup>
			<h3>Markery</h3>
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