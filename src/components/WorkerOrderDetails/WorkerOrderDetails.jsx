import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getWorkerToken} from "../../jwtToken.js";
import {Spinner, Table, Button, Accordion, FormControl} from "react-bootstrap";
import workerAxios from "../../axios/workerAxios.js";

function WorkerOrderDetails() {
	const [order, setOrder] = useState(null);
	const {orderNumber} = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [editedMarkers, setEditedMarkers] = useState({});
	useEffect(() => {
		setIsLoading(true);
		workerAxios.get(`/order/${orderNumber}`)
			.then(response => {
				console.log(response.data);
				setOrder(response.data);
				setIsLoading(false);
			});

	}, [orderNumber])

	const patchResult = async () => {
		let data = {
			orderNumber: order.orderNumber,
			results: editedMarkers
		};
		try {
			await workerAxios.patch(`/order/${orderNumber}`, data, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`
				}
			})
			location.reload();
		}
		catch (error) {
			console.log(error);
		}
	};

	return (
		isLoading ?
			<Spinner animation="grow"/>
			:
			<>
				<h1>Szczegóły zlecenia nr {orderNumber}</h1>
				<Accordion defaultActiveKey="0">
					<Accordion.Header>Dane pacjenta</Accordion.Header>
						<Accordion.Body>
								<Table striped bordered hover>
									<tbody>
										<tr>
											<td>Imie i nazwisko</td>
											<td>{order.fullName}</td>
										</tr>
										<tr>
											<td>Pesel</td>
											<td>{order.pesel}</td>
										</tr>
										<tr>
											<td>Data urodzenia</td>
											<td>{order.dateOfBirth}</td>
										</tr>
										<tr>
											<td>Płeć</td>
											<td>{order.sex}</td>
										</tr>
									</tbody>
								</Table>
						</Accordion.Body>
				</Accordion>
				{order.tests.map((test) => {
					return (
						<Accordion key={test.id}>
							<Accordion.Header>{test.shortName} {test.name}</Accordion.Header>
							<Accordion.Body>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Wskaźnik</th>
											<th>Wynik</th>
											<th>Jednostka</th>
											<th>Dolna norma</th>
											<th>Górna norma</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{test.markers.map((marker) => {
											return (
												<tr key={marker.id}>
													<td><strong>{marker.shortName}</strong> {marker.name}</td>
													<td>{marker.result}</td>
													<td>{marker.unit}</td>
													<td>{marker.lowerNorm}</td>
													<td>{marker.higherNorm}</td>
													<td>
														<FormControl
															type="text"
															value={marker.result}
															disabled={marker.result !== undefined && marker.result !== null && marker.result !== ''}
															onChange={e => {
																let modified = {...editedMarkers};
																if(e.target.value !== null && e.target.value !== '') {
																	if(!modified[test.shortName]) {
																		modified[test.shortName] = {};
																		test.markers.forEach(r=> {
																			modified[test.shortName][r.shortName] = r.result ?? '';
																		});
																	}
																	modified[test.shortName][marker.shortName] = e.target.value;
																}
																else {
																	if(modified[test.shortName]) {
																		modified[test.shortName][marker.shortName] = '';
																		if(Object.values(modified[test.shortName]).every(v => v === '')) {
																			delete modified[test.shortName];
																		}
																	}
																}
																setEditedMarkers(modified);
															}}
														/>
													</td>
												</tr>
											)
										})}
									</tbody>
								</Table>
							</Accordion.Body>
						</Accordion>
					)
				})}
				<Button variant="success" onClick={patchResult}>Zapisz zmiany</Button>
			</>
	)
}

export default WorkerOrderDetails;