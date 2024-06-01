import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Spinner} from "react-bootstrap";
import EditTestMarker from "../EditTestMarker/EditTestMarker.jsx";
import workerAxios from "../../axios/workerAxios.js";

function WorkerTestDetails() {
	const {id} = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [test, setTest] = useState(null);

	useEffect(() => {
		getTest();
	}, []);
	const getTest = async () => {
		try {
			const response = await workerAxios.get(`tests/${id}`);
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
			const response = await workerAxios.put(`tests/${id}`, test);
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