import {useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {Accordion, Button, Form, FormGroup, Spinner} from "react-bootstrap";
import {getWorkerToken} from "../../jwtToken.js";
import EditTestMarker from "../EditTestMarker.jsx";

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
			<EditTestMarker test={test} setTest={setTest}/>
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