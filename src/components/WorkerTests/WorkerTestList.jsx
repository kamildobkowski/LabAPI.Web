import {ListGroup, Spinner, Container, Row, Col, Button, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {getWorkerToken} from "../../jwtToken.js";
import {useNavigate} from "react-router-dom";

function WorkerTestList() {
	const [isLoading, setIsLoading] = useState(true);
	const [tests, setTests] = useState([]);
	const [selectedTest, setSelectedTest] = useState(null);
	const [testToDelete, setTestToDelete] = useState(null);
	const navigate = useNavigate();

	const getTests = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`tests`, {
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

	const deleteTest = async () => {
		setIsLoading(true);
		try {
			await axios.delete(`tests/${testToDelete.id}`, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			await getTests();
		} catch (error) {
			console.error(error);
		}
		setTestToDelete(null);
	}

	useEffect(() => {
		getTests();
	}, []);
	return (
		isLoading ?
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
			: <Container fluid>
				<Row>
					<Col>
						<h1>Lista Testów</h1>
						<ListGroup variant="flush">
							{tests.map(t => {
								return (
									<ListGroup.Item action key={t.id} style={{boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', margin: '10px 0'}} onClick={() => setSelectedTest(t)}>
										<Row>
											<Col xs={10}>
												<h5>{t.name}</h5>
												<small className="text-muted">{t.shortName}</small>
											</Col>
											<Col xs={2} className="d-flex justify-content-end">
												<Button variant="info" onClick={(e)=>{e.stopPropagation(); navigate(`/lab/test/edit/${t.id}`);}}>Edytuj</Button>
												<Button variant="danger" onClick={(e)=>{e.stopPropagation(); setTestToDelete(t);}}>Usuń</Button>
											</Col>
										</Row>
									</ListGroup.Item>
								)
							})}
						</ListGroup>
					</Col>
				</Row>
				<Button variant="outline-success" onClick={(e)=> {e.stopPropagation(); navigate(`/lab/test/add`)}}>Dodaj nowy test</Button>
				<Modal show={selectedTest !== null} onHide={() => setSelectedTest(null)}>
					<Modal.Header closeButton>
						<Modal.Title>Szczegóły testu</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{selectedTest && (
							<>
								<h5>{selectedTest.name}</h5>
								<p>{selectedTest.shortName}</p>
								{selectedTest.markers.map(m => {
									return (
										<div key={m.shortName}>
											<h6>{m.name} ({m.unit})</h6>
										</div>
									)
								})}
							</>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setSelectedTest(null)}>Zamknij</Button>
					</Modal.Footer>
				</Modal>
				<Modal show={testToDelete !== null} onHide={() => setTestToDelete(null)}>
					<Modal.Header closeButton>
						<Modal.Title>Usuń test</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Czy na pewno chcesz usunąć test {testToDelete && testToDelete.name}?
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setTestToDelete(null)}>Nie</Button>
						<Button variant="danger" onClick={deleteTest}>Tak</Button>
					</Modal.Footer>
				</Modal>
			</Container>
	)
}

export default WorkerTestList;