import {ListGroup, Spinner, Container, Row, Col, Button, Modal, Pagination} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {getWorkerToken} from "../../jwtToken.js";
import {useLocation, useNavigate} from "react-router-dom";

function WorkerTestList() {
	const [isLoading, setIsLoading] = useState(true);
	const [tests, setTests] = useState([]);
	const [pagedList, setPagedList] = useState(null);
	const [selectedTest, setSelectedTest] = useState(null);
	const [testToDelete, setTestToDelete] = useState(null);
	const navigate = useNavigate();

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const [page, setPage] = useState(Number(queryParams.get('page') ?? 1));

	const getTests = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`tests?page=${page}&pageSize=2`, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			console.log(response.data);
			setPagedList(response.data);
			setTests(response.data.list);
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
		console.log(page);
	}, [page]);
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
			<Pagination>
				<Pagination.First/>
				<Pagination.Prev/>
				{pagedList && [...Array(pagedList.pageCount)].map((_, i) => (
					<Pagination.Item key={i+1} active={i+1 === page} onClick={() => {
						setPage(i+1);
						navigate(`/lab/test?page=${i+1}`);
					}}>
						{i+1}
					</Pagination.Item>
				))}
				<Pagination.Next/>
				<Pagination.Last/>
			</Pagination>
			</Container>
	)
}

export default WorkerTestList;