import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, ListGroup, Row, Spinner} from "react-bootstrap";
import {getWorkerToken} from "../../jwtToken.js";

function WorkerOrders() {
	const [isLoading, setIsLoading] = useState(true);
	const [pagedList, setPagedList] = useState(null);
	const [orders, setOrders] = useState([]);

	const fetchOrders = async () => {
		setIsLoading(true);
		let url = `order`;
		try {
			const response = await axios.get(url, {
				headers: {
					"Authorization": `Bearer ${getWorkerToken()}`,
				}
			});
			console.log(response.data);
			setPagedList(response.data);
			setOrders(response.data.list);
			setIsLoading(false);
		}
		catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchOrders().catch(error => console.error(error));

	}, []);

	return (
		<>
			<h1>Przeglądaj zlecenia</h1>
			{isLoading
				?
				<Spinner animation="grow"/>
				:
				<Row>
					<Col>
						<ListGroup variant="flush">
							{orders.map(order => {
								return (
									<ListGroup.Item action key={order.orderNumber}>
										<Row>
											<Col>
												<h5>{order.orderNumber}</h5>
											</Col>
											<Col>
												<h5>{order.fullName}</h5>
												<small>{order.pesel}</small>
											</Col>
											<Col>
												<Status status={order.status}/>
											</Col>
										</Row>

									</ListGroup.Item>
								)
							})}
						</ListGroup>
					</Col>
				</Row>
			}
		</>

	)
}

function Status({status}) {
	switch (status) {
		case "Registered":
			return <Button variant="info">Zarejestrowano</Button>;
		case "PdfReady":
			return <Button variant="success">Pdf gotowy</Button>;
		case "ResultsReady":
			return <Button variant="outline-success">Wyniki gotowe</Button>;
		case "ResultsAccepted":
			return <Button variant="outline-primary">Wyniki zaakceptowane</Button>;
		default:
			return <Button variant="secondary">{status}</Button>;
	}
}

export default WorkerOrders;