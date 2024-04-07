import {ListGroup, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {getWorkerToken} from "../../jwtToken.js";
import {useNavigate} from "react-router-dom";

function WorkerTestList() {
	const [isLoading, setIsLoading] = useState(true);
	const [tests, setTests] = useState([]);
	const navigate = useNavigate();

	const getTests = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`tests?page`, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			console.log(response.data);
			setTests(response.data);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getTests();
	}, []);
	return (
		isLoading ?
			<Spinner animation="grow" size="sm"/>
			: <ListGroup>
				{tests.map(t => {
					return (
						<ListGroup.Item key={t.id} onClick={()=>navigate(`/lab/tests/${t.id}`)}>
							<p>({t.shortName} {t.name})</p>
						</ListGroup.Item>
					)
				})}
			</ListGroup>
	)
}

export default WorkerTestList;