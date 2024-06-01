import {useEffect, useState} from "react";
import {Button, Col, Dropdown, Form, ListGroup, Pagination, Row, Spinner} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import workerAxios from "../../axios/workerAxios.js";

function WorkerOrders() {
	const [isLoading, setIsLoading] = useState(true);
	const [pagedList, setPagedList] = useState(null);
	const [orders, setOrders] = useState([]);
	const navigate = useNavigate();

	const pageSizes = [10, 20, 30];
	const defaultPageSize = 20;

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const [page, setPage] = useState(Number(queryParams.get('page') ?? 1));
	const pageSizeQuery = queryParams.get('pageSize');
	const pageSizeValue = Number(pageSizeQuery);
	const [pageSize, setPageSize] = useState(
		pageSizes.includes(pageSizeValue) ? pageSizeValue : defaultPageSize
	);
	const [search, setSearch] = useState(queryParams.get('search') ?? '');

	const sortParams = {
		"Numer zlecenia": "OrderNumber",
		"Nazwisko": "Name"
	}

	const [asc, setAsc] = useState(false);
	const [sortBy, setSortBy] = useState(queryParams.get('sortBy') ?? "Numer zlecenia");

	const [selectedStatuses, setSelectedStatuses] = useState(queryParams.getAll('statuses').reduce((obj, str) => {
		obj[str] = true;
		return obj;
	}, {}));

	const fetchOrders = async (url) => {
		url = getUrl();
		setIsLoading(true);
		try {
			const response = await workerAxios.get(url);
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
		handleSearchButtonClick().catch(console.error);
	}, [page]);

	const pageSizeClick = (size) => {
		setPageSize(size);
		setPage(1);
	}

	const handleSearchButtonClick = async () => {
		await fetchOrders().catch(console.error);
		navigate(`/lab/${getUrl()}`);
	}

	const getUrl = () => {
		let url = `order?page=${page}&pageSize=${pageSize}&sort=${sortParams[sortBy]}&asc=${asc}`;
		if(search !== '' && search !== null) {
			url += `&filter=${search}`;
		}
		if(Object.values(selectedStatuses).some(val => val === true)) {
			url += Object.keys(selectedStatuses).filter(key => selectedStatuses[key]).map(key => `&statuses=${key}`).join('');
		}
		return url
	}

	return (
		<>
			<h1>Przeglądaj zlecenia</h1>
			{isLoading
				?
				<Spinner animation="grow"/>
				:
				<>
					<Row>
						<Col>
							<Form onSubmit={handleSearchButtonClick}>
								<Row>
									<Col>
										<Form.Control type="text" placeholder="Wyszukaj zlecenie po numerze lub po nazwisku pacjenta"
																	value={search} onChange={(e) => setSearch(e.target.value)}/>
									</Col>
								</Row>
							</Form>
							<Row>
								<Col>
									<Dropdown>
										<Dropdown.Toggle variant="primary-outline" id="dropdown-basic">Liczba na stronie: {pageSize}</Dropdown.Toggle>
										<Dropdown.Menu>
											{pageSizes.map((size) => {
												return (
													<Dropdown.Item key={size} onClick={() => pageSizeClick(size)}>{size}</Dropdown.Item>
												)
											})}
										</Dropdown.Menu>
									</Dropdown>
								</Col>
								<Col>
									<Dropdown>
										<Dropdown.Toggle variant="success-outline" id="dropdown-sortBy">Sortuj po: {sortBy} {asc ? 'rosnąco' : 'malejąco'}</Dropdown.Toggle>
										<Dropdown.Menu>
											{Object.keys(sortParams).map((key) => {
												return(
													<>
														<Dropdown.Item key={key + "asc"} onClick={()=> {
															setSortBy(key);
															setAsc(true);
														}}>
															{key} rosnąco
														</Dropdown.Item>
														<Dropdown.Item key={key + "desc"} onClick={()=> {
															setSortBy(key);
															setAsc(false);
														}}>
															{key} malejąco
														</Dropdown.Item>
													</>
												)
											})}
										</Dropdown.Menu>
									</Dropdown>
								</Col>
								<Col>
									<Dropdown>
										<Dropdown.Toggle variant="" id="dropdown-status-filter">Filtruj po statusie</Dropdown.Toggle>
										<Dropdown.Menu>
											{Object.keys(Statuses).map((val) => {
												return(
													<>
														<Form.Check
															type="checkbox"
															id={`status-${val}`}
															label={Statuses[val]}
															checked={!!selectedStatuses[val]}
															onChange={() => {
																setSelectedStatuses(prevStatuses => ({
																	...prevStatuses,
																	[val]: !prevStatuses[val]
																}));
															}}
														/>
													</>
												)
											})}
										</Dropdown.Menu>
									</Dropdown>
								</Col>
							</Row>
						</Col>
						<Col md={1}>
							<Button variant="primary" style={{height: '100%'}} onClick={handleSearchButtonClick}>Wyszukaj</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<ListGroup variant="flush">
								{orders.map(order => {
									return (
										<ListGroup.Item key={order.orderNumber}>
											<Row onClick={() => {
												navigate(`/lab/order/details/${order.orderNumber}`);
											}}>
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
					<Pagination>
						<Pagination.First onClick={() => {
							setPage(1);
						}}/>
						<Pagination.Prev onClick={() => {
							setPage(Math.max(page - 1, 1));
						}}/>
						{pagedList && [...Array(pagedList.pageCount)].map((_, i) => {
							return (
								<Pagination.Item key={i+1} active={i+1 === page} onClick={() => {
									setPage(i+1);
								}}>
									{i+1}
								</Pagination.Item>
							)
						})}
						<Pagination.Next onClick={() => {
							setPage(Math.min(page + 1, pagedList.pageCount));
						}}/>
						<Pagination.Last onClick={() => {
							setPage(pagedList.pageCount);
						}}/>
					</Pagination>
				</>

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

const Statuses = {
	"Registered": "Zarejestrowano",
	"PdfReady": "Pdf gotowy",
	"ResultsReady": "Wyniki gotowe",
	"ResultsAccepted": "Wyniki zaakceptowane"
}

export default WorkerOrders;