import {useEffect, useState} from "react";
import workerAxios from "../../axios/workerAxios.js";
import {useLocation, useNavigate} from "react-router-dom";
import {
	Button,
	Col,
	Dropdown,
	Form, ListGroup,
	Modal,
	ModalBody, Pagination,
	Row,
	Spinner
} from "react-bootstrap";

import checkmark from '../../assets/checkmark.svg';

function AdminWorkerList() {
	const [isLoading, setIsLoading] = useState(true);
	const [workers, setWorkers] = useState([]);
	const [pagedList, setPagedList] = useState(null);

	const fetchWorkers = async () => {
		setIsLoading(true);
		await workerAxios.get(getUrl())
			.then(response => {
				setPagedList(response.data);
				setWorkers(response.data.list);
				setIsLoading(false);
			})
			.catch(error => {
				console.log(error);
			});
	}
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

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedWorker, setSelectedWorker] = useState(null);

	const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
	const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);
	const [isLoadingGeneratedPassword, setIsLoadingGeneratedPassword] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState('');

	const [showAddUserModal, setShowAddUserModal] = useState(false);
	const [newUser, setNewUser] = useState({});
	const [isLoadingNewUser, setIsLoadingNewUser] = useState(false);
	const [showGeneratedUser, setShowGeneratedUser] = useState(false);
	const [newUserResponse, setNewUserResponse] = useState(null);
	const [copyCheckmarkVisible, setCopyCheckmarkVisible] = useState(false);

	const handleAddUser = async () => {
		setShowGeneratedUser(true);
		setIsLoadingNewUser(true);
		await workerAxios.post('worker/register', newUser)
			.then((response) => {
				setNewUserResponse(response.data);
				setWorkers([
					{
						fullName: `${response.data.name} ${response.data.surname}`,
						email: response.data.email,
						role: response.data.role
					}, ...workers]);
			})
			.then(() => setIsLoadingNewUser(false))
			.catch(console.error);
		console.log(newUserResponse);
	}

	const handleDeleteClick = (worker) => {
		setSelectedWorker(worker);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		await workerAxios.delete(`worker/${selectedWorker.email}`)
			.then(()=> setShowDeleteModal(false))
			.then(() => fetchWorkers());
	};

	const handleResetClick = (worker) => {
		setSelectedWorker(worker);
		setShowResetPasswordModal(true);
	}


	const handleNewUserCopy = async () => {
		await navigator.clipboard.writeText(`Imie: ${newUserResponse.name}\nNazwisko: ${newUserResponse.surname}\nEmail: ${newUserResponse.email}\nHasło: ${newUserResponse.password}`);
		setCopyCheckmarkVisible(true);
		setTimeout(() => setCopyCheckmarkVisible(false), 2000); // Overlay will disappear after 2 seconds
	};

	const handleGeneratedPasswordCopy = async () => {
		await navigator.clipboard.writeText(`Email: ${selectedWorker.email}\nHasło: ${generatedPassword}`);
		setCopyCheckmarkVisible(true);
		setTimeout(() => setCopyCheckmarkVisible(false), 2000);
	}

	useEffect(() => {
		handleSearchButtonClick().catch(console.error);
	}, [page]);

	const pageSizeClick = (size) => {
		setPageSize(size);
		setPage(1);
	}

	const handleSearchButtonClick = async () => {
		await fetchWorkers().catch(console.error);
		navigate(`/lab/admin/${getUrl()}`);
	}

	const handleGeneratedPassword = async () => {
		setShowGeneratedPassword(true);
		setIsLoadingGeneratedPassword(true);
		await workerAxios.post(`worker/resetPassword/${selectedWorker.email}`)
			.then(response => {
				setGeneratedPassword(response.data);
				setIsLoadingGeneratedPassword(false);
			})
			.catch(error => {
				console.error(error);
			})
	}

	const getUrl = () => {
		let url = `worker?page=${page}&pageSize=${pageSize}`;
		if(search !== '' && search !== null) {
			url += `&filter=${search}`;
		}
		return url
	}

	return (
		<>
			<h1>Przeglądaj pracowników</h1>
			{isLoading
				?
				<Spinner animation="grow"/>
				:
				<>
					<Row>
						<Col>
							<Form onSubmit={handleSearchButtonClick}>
										<Form.Control type="text" placeholder="Wyszukaj konto po imieniu i nazwisku lub po emailu"
																	value={search} onChange={(e) => setSearch(e.target.value)}/>
							</Form>
						</Col>
						<Col md={2}>
							<Button variant="primary" style={{height: '100%'}} onClick={handleSearchButtonClick}>Wyszukaj</Button>
						</Col>
					</Row>
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
					</Row>
					<Button onClick={() => setShowAddUserModal(true)}>Dodaj użytkownika</Button>
					<Row>
						<Col>
							<ListGroup variant="flush">
								{workers.map(worker => {
									return (
										<ListGroup.Item key={worker.email}>
											<Row>
												<Col>
													<h5>{worker.fullName}</h5>
													<p>{worker.email}</p>
												</Col>
												<Col>
													<Role role={worker.role}/>
												</Col>
												<Col md={2}>
													<Row>
														<Button variant="danger" onClick={() => handleDeleteClick(worker)}>Usuń konto</Button>
													</Row>
													<Row>
														<Button variant="warning" onClick={() => handleResetClick(worker)}>Wygeneruj nowe hasło</Button>
													</Row>
												</Col>
											</Row>
										</ListGroup.Item>
									)
								})}
							</ListGroup>
						</Col>
					</Row>
					<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
						<Modal.Header closeButton>
							<Modal.Title>Potwierdzenie usunięcia</Modal.Title>
						</Modal.Header>
						<Modal.Body>Czy na pewno chcesz usunąć konto pracownika {selectedWorker?.fullName}?</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
								Anuluj
							</Button>
							<Button variant="danger" onClick={handleConfirmDelete}>
								Usuń
							</Button>
						</Modal.Footer>
					</Modal>
					<Modal show={showResetPasswordModal} onHide={() =>
					{
						setShowResetPasswordModal(false);
						setShowGeneratedPassword(false);
					}}>
						<Modal.Header closeButton>
							<Modal.Title>Resetowanie hasła</Modal.Title>
						</Modal.Header>
						<Modal.Body>Czy na pewno chcesz zresetować hasło pracownika {selectedWorker?.fullName}?</Modal.Body>
						{isLoadingGeneratedPassword ? <Spinner animation="grow"/> :
							<Modal.Body hidden={!showGeneratedPassword}>
								<p>Nowe hasło: {generatedPassword}</p>
								<Button variant="outline-dark" onClick={handleGeneratedPasswordCopy}>Skopiuj do schowka</Button>
								<img src={checkmark} style={{
									height: '1rem',
									fill: "green",
									opacity: copyCheckmarkVisible ? 1 : 0,
									transition: 'opacity 0.5s',
									marginLeft: '1rem'
								}} alt="checkmark"/>
							</Modal.Body>}
						<Modal.Footer>
							<Button variant="secondary" onClick={() => setShowResetPasswordModal(false)}>
								Anuluj
							</Button>
							<Button variant="warning" onClick={handleGeneratedPassword}>
								Resetuj
							</Button>
						</Modal.Footer>
					</Modal>
					<Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
						<Modal.Header closeButton>
							<Modal.Title>Dodaj użytkownika</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form>
								<Form.Group>
									<Form.Label>Imię</Form.Label>
									<Form.Control value={newUser.name} onChange={(e)=>{e.stopPropagation(); setNewUser({...newUser, name: e.target.value})}} type="text"/>
									<Form.Label>Nazwisko</Form.Label>
									<Form.Control value={newUser.surname} type="text" onChange={(e)=>{e.stopPropagation(); setNewUser({...newUser, surname: e.target.value})}}/>
									<Form.Label>Email</Form.Label>
									<Form.Control value={newUser.email} type="email" onChange={(e)=>{e.stopPropagation(); setNewUser({...newUser, email: e.target.value})}}/>
									<Form.Label>Rola</Form.Label>
									<Form.Select value={newUser.userRole} onChange={(e)=>{e.stopPropagation(); setNewUser({...newUser, userRole: e.target.value})}}>
										<option value="">Wybierz rolę</option>
										<option value="Admin">Administrator</option>
										<option value="LabWorker">Pracownik</option>
										<option value="LabManager">Kierownik</option>
									</Form.Select>
								</Form.Group>
							</Form>
						</Modal.Body>
						<ModalBody hidden={!showGeneratedUser}>
							{isLoadingNewUser ? <Spinner animation="grow"/> :
								<>
									<h5>Użytkownik został dodany</h5>
									<p>Imie: {newUserResponse?.name}</p>
									<p>Nazwisko: {newUserResponse?.surname}</p>
									<p>Email: {newUserResponse?.email}</p>
									<p>Nowe hasło: {newUserResponse?.password}</p>
									<Button variant="outline-dark" onClick={handleNewUserCopy}>Skopiuj do schowka</Button>
									<img src={checkmark} style={{
										height: '1rem',
										fill: "green",
										opacity: copyCheckmarkVisible ? 1 : 0,
										transition: 'opacity 0.5s',
										marginLeft: '1rem'
									}} alt="checkmark"/>
								</>}
						</ModalBody>
						<Modal.Footer>
							<Button variant="success" onClick={handleAddUser}>Dodaj</Button>
						</Modal.Footer>
					</Modal>
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

// eslint-disable-next-line react/prop-types
const Role = ({role}) => {
	switch(role) {
		case "Admin":
			return (
				<>
					<Button variant="success" style={{width: '8rem', height: '100%'}}>Administrator</Button>
				</>
			)
		case "LabWorker":
			return (
				<>
					<Button variant="primary" style={{width: '8rem', height: '100%'}}>Pracownik</Button>
				</>
			)
		case "LabManager":
			return (
				<>
					<Button variant="warning" style={{width: '8rem', height: '100%'}}>Kierownik</Button>
				</>
			)
	}
}

export default AdminWorkerList;