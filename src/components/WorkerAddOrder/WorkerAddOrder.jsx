import { useState, useEffect } from 'react';
import {
	Button,
	Form,
	FormControl,
	ListGroup,
	InputGroup,
	Spinner,
	Alert,
	ProgressBar,
	Col,
	Row,
	Modal
} from 'react-bootstrap';
import './WorkerAddOrder.css';
import {useNavigate} from "react-router-dom";
import workerAxios from "../../axios/workerAxios.js";

function WorkerAddOrder() {
	const [tests, setTests] = useState([]);
	const [filteredTests, setFilteredTests] = useState([]);
	const [selectedTests, setSelectedTests] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isAlertVisible, setIsAlertVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const [pesel, setPesel] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [street, setStreet] = useState('');
	const [houseNumber, setHouseNumber] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [city, setCity] = useState('');
	const [noPesel, setNoPesel] = useState(false);
	const [birthDate, setBirthDate] = useState('');
	const [gender, setGender] = useState('');
	const [orderNumber, setOrderNumber] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		fetchTests();
	}, []);

	useEffect(() => {
		if (isAlertVisible) {
			setProgress(0);
			const timer = setInterval(() => {
				setProgress((oldProgress) => {
					if (oldProgress >= 100) {
						setIsAlertVisible(false);
						clearInterval(timer);
						return 0;
					}
					return oldProgress + 1; // Increase by 1% every 50 milliseconds
				});
			}, 50); // Update every 50 milliseconds

			// Cleanup function to clear the timer if the component unmounts
			return () => clearInterval(timer);
		}
	}, [isAlertVisible]);

	useEffect(() => {
		if (!noPesel && pesel.length === 11) {
			const genderNumber = parseInt(pesel[9]);
			setGender(genderNumber % 2 === 0 ? 'Kobieta' : 'Mężczyzna');
		}
	}, [pesel, noPesel]);
	useEffect(() => {

	},[errors]);

	const fetchTests = () => {
		setIsLoading(true);
		let url = '/tests';
		workerAxios.get(url)
			.then(response => {
				setTests(response.data);
				setIsLoading(false);
				setFilteredTests(response.data);
			})
			.catch(error => {
				console.error(error);
				setIsLoading(false);
			});
	};

	const postOrder = async () => {
		const isValid = validateOrder();
		if(!isValid) {
			return;
		}
		let order = {
			name: firstName,
			surname: lastName,
			addressStreet: street,
			addressCity: city,
			addressNumber: houseNumber,
			addressPostalCode: postalCode,
			tests: selectedTests.map(test => test.shortName)
		};
		if(noPesel) {
			order.birthDate = birthDate;
		}
		else {
			order.pesel = pesel;
		}
		if(gender==='Mężczyzna') {
			order.sex = 'm';
		}
		else {
			order.sex = 'f';
		}
		await workerAxios.post('/order', order).then(response => {
			const location = response.headers.location;
			setOrderNumber(location.split('/').pop());
			setShowModal(true);
		})
	}

	const validateOrder = () => {
		let errors = {};
		if(noPesel) {
			if(!birthDate) {
				errors.birthDate = 'Data urodzenia jest wymagana';
			}
			if(!gender) {
				errors.gender = 'Płeć jest wymagana';
			}
		}
		else {
			if(!pesel) {
				errors.pesel = 'PESEL jest wymagany';
			}
			else {
				const regex = /^[0-9]{11}$/;
				if(!regex.test(pesel)) {
					errors.pesel = 'PESEL musi zawierać 11 cyfr';
				}
				if(!validatePesel(pesel)) {
					errors.pesel = 'Niepoprawny numer PESEL';
				}
			}
		}
		if(!firstName) {
			errors.firstName = 'Imię jest wymagane';
		}
		if(!lastName) {
			errors.lastName = 'Nazwisko jest wymagane';
		}
		if(!street) {
			errors.street = 'Ulica jest wymagana';
		}
		if(!houseNumber) {
			errors.houseNumber = 'Numer domu jest wymagany';
		}
		if(!postalCode) {
			errors.postalCode = 'Kod pocztowy jest wymagany';
		}
		else {
			const regex = /^[0-9]{2}-[0-9]{3}$/;
			if (!regex.test(postalCode)) {
				errors.postalCode = 'Kod pocztowy musi być w formacie XX-XXX';
			}
		}
		if(!city) {
			errors.city = 'Miasto jest wymagane';
		}
		if(selectedTests.length === 0) {
			errors.tests = 'Co najmniej jeden test jest wymagany';
		}
		setErrors({...errors});
		return Object.keys(errors).length === 0;
	}

	const handleInputChange = (event) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		setFilteredTests(filterTests(tests, newValue));
	};

	const handleRemoveTest = (testToRemove) => {
		setSelectedTests(selectedTests.filter(test => test !== testToRemove));
	};

	const resetForm = () => {
		setTests([]);
		setFilteredTests([]);
		setSelectedTests([]);
		setInputValue('');
		setIsLoading(false);
		setIsFocused(false);
		setIsHovered(false);
		setIsAlertVisible(false);
		setProgress(0);
		setPesel('');
		setFirstName('');
		setLastName('');
		setStreet('');
		setHouseNumber('');
		setPostalCode('');
		setCity('');
		setNoPesel(false);
		setBirthDate('');
		setGender('');
		setOrderNumber(null);
		setShowModal(false);
	};

	return (
		<>
			<div className="container">
				<h1 className="title">Nowe zlecenie</h1>
				<Form className="form">
					<h2 className="subtitle">Dane pacjenta</h2>
					<Form.Group controlId="formPesel">
						<Form.Label>PESEL</Form.Label>
						<Form.Control type="text" placeholder="Wpisz PESEL" value={pesel} onChange={e => setPesel(e.target.value)} disabled={noPesel} isInvalid={!!errors.pesel}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.pesel}>{errors.pesel}</Form.Control.Feedback>
						<Form.Check type="checkbox" label="Pacjent nie posiada numeru PESEL" onChange={e => {
							setNoPesel(e.target.checked)
							setPesel('');
							setGender('');
						}} />
					</Form.Group>
					{noPesel && (
						<Form.Group controlId="formBirthDate">
							<Form.Label>Data urodzenia</Form.Label>
							<Form.Control type="date" max={new Date().toISOString().split("T")[0]} value={birthDate} onChange={e => setBirthDate(e.target.value)} isInvalid={!!errors.birthDate}/>
							<Form.Control.Feedback type="invalid" hidden={!errors.birthDate}>{errors.birthDate}</Form.Control.Feedback>
						</Form.Group>
					)}
					<Form.Group controlId="formGender">
						<Form.Label>Płeć</Form.Label>
						<Form.Control as="select" value={gender} onChange={e => setGender(e.target.value)} disabled={!noPesel} isInvalid={!!errors.gender}>
							<option value="">Wybierz płeć</option>
							<option value="Kobieta">Kobieta</option>
							<option value="Mężczyzna">Mężczyzna</option>
						</Form.Control>
						<Form.Control.Feedback type="invalid" hidden={!errors.gender}>{errors.gender}</Form.Control.Feedback>
					</Form.Group>
					<Form.Group controlId="formFirstName">
						<Form.Label>Imię</Form.Label>
						<Form.Control type="text" placeholder="Wpisz imię" value={firstName}
													onChange={e => setFirstName(e.target.value)} isInvalid={!!errors.firstName}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.firstName}>{errors.firstName}</Form.Control.Feedback>
					</Form.Group>
					<Form.Group controlId="formLastName">
						<Form.Label>Nazwisko</Form.Label>
						<Form.Control type="text" placeholder="Wpisz nazwisko" value={lastName}
													onChange={e => setLastName(e.target.value)} isInvalid={!!errors.lastName}/>
						<Form.Control.Feedback type="invalid" hidden={!errors.lastName}>{errors.lastName}</Form.Control.Feedback>
					</Form.Group>
					<Row>
						<Form.Group as={Col} controlId="formStreet">
							<Form.Label>Ulica</Form.Label>
							<Form.Control type="text" placeholder="Wpisz ulicę" value={street} onChange={e => setStreet(e.target.value)} isInvalid={!!errors.street}/>
							<Form.Control.Feedback type="invalid" hidden={!errors.street}>{errors.street}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} controlId="formHouseNumber">
							<Form.Label>Numer domu</Form.Label>
							<Form.Control type="text" placeholder="Wpisz numer domu" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} isInvalid={!!errors.houseNumber}/>
							<Form.Control.Feedback type="invalid" hidden={!errors.houseNumber}>{errors.houseNumber}</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row>
						<Form.Group as={Col} controlId="formCity">
							<Form.Label>Miasto</Form.Label>
							<Form.Control type="text" placeholder="Wpisz miasto" value={city} onChange={e => setCity(e.target.value)} isInvalid={!!errors.city}/>
							<Form.Control.Feedback type="invalid" hidden={!errors.city}>{errors.city}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} controlId="formPostalCode">
							<Form.Label>Kod pocztowy</Form.Label>
							<Form.Control type="text" placeholder="Wpisz kod pocztowy" value={postalCode} onChange={e => setPostalCode(e.target.value)} isInvalid={!!errors.postalCode}/>
							<Form.Control.Feedback type="invalid" hidden={!errors.postalCode}>{errors.postalCode}</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<h2 className="subtitle">Testy</h2>
					<ListGroup className="list-group">
						{selectedTests.sort((a, b) =>
							a.shortName.localeCompare(b.shortName)).map((selectedTest, index) => (
							<ListGroup.Item key={index} className="list-group-item">
								<Row className="d-flex align-items-center">
									<Col xs={8}>
										{selectedTest.shortName} {selectedTest.name}
									</Col>
									<Col xs={4} className="d-flex justify-content-end">
										<Button variant="danger" onClick={() => handleRemoveTest(selectedTest)}>Usuń</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
					<h3 className="subtitle">Dodaj test</h3>
					<InputGroup className="input-group">
						<FormControl
							placeholder="Wpisz tekst"
							value={inputValue}
							onChange={handleInputChange}
							onFocus={() => setIsFocused(true)}
							onBlur={() => !isHovered && setIsFocused(false)}
							className="form-control"
							isInvalid={!!errors.tests}
						/>
						<Form.Control.Feedback type="invalid" hidden={!errors.tests}>{errors.tests}</Form.Control.Feedback>
					</InputGroup>
					{isLoading ? (
						<Spinner animation="border" role="status" className="spinner">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					) : (isFocused || isHovered) && (
						<ListGroup style={{maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'thin'}}
											onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
											className="list-group">
							{filteredTests.map(test => (
								<ListGroup.Item key={test.id} onClick={() => {
									if (selectedTests.includes(test)) {
										setIsAlertVisible(false);
										setIsAlertVisible(true);
									} else {
										setSelectedTests([...selectedTests, test]);
									}
								}} className="list-group-item">
									{test.shortName} {test.name}
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
					<Button variant="primary" className="button" onClick={postOrder}>
						Dodaj zlecenie
					</Button>
				</Form>
				<Modal show={showModal} onHide={() => setShowModal(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Test dodano</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Test został pomyślnie dodany.
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => {
							navigate(`/lab/order/${orderNumber}`);
							setShowModal(false);
						}}>
							Przejdź do testu
						</Button>
						<Button variant="primary" onClick={() => {
							resetForm();
						}}>
							Dodaj kolejny test
						</Button>
					</Modal.Footer>
				</Modal>
				<Alert hidden={!isAlertVisible} variant="danger" style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'fixed',
					bottom: '0',
					left: '0',
					padding: '10px',
					width: '15rem'
				}} className="alert">
					Test jest już dodany!
					<ProgressBar now={progress} variant="danger" style={{
						height: '2px',
						position: 'absolute',
						bottom: '0',
						width: '100%',
						left: '0',
						right: '0'
					}}></ProgressBar>
				</Alert>
			</div>
		</>
	);
}

const filterTests = (tests, inputValue) => {
	return [...tests].filter(test =>
		test.name.toLowerCase().includes(inputValue.toLowerCase()) ||
		test.shortName.toLowerCase().includes(inputValue.toLowerCase()));
}

function validatePesel(pesel) {
	const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
	let sum = 0;

	for (let i = 0; i < 10; i++) {
		sum += (parseInt(pesel[i]) * weights[i]);
	}
	sum = sum % 10;
	if (10 - sum !== parseInt(pesel[10])) {
		return 'Niepoprawna suma kontrolna numeru PESEL';
	}

	let year = parseInt(pesel.substring(0, 2), 10);
	let month = parseInt(pesel.substring(2, 4), 10);
	let day = parseInt(pesel.substring(4, 6), 10);

	if (month > 80) {
		year += 1800;
		month = month - 80;
	} else if (month > 60) {
		year += 2200;
		month = month - 60;
	} else if (month > 40) {
		year += 2100;
		month = month - 40;
	} else if (month > 20) {
		year += 2000;
		month = month - 20;
	} else {
		year += 1900;
	}

	const birthDate = new Date(year, month - 1, day);
	if (!(birthDate.getFullYear() === year && birthDate.getMonth() === month - 1 && birthDate.getDate() === day)) {
		return 'Niepoprawna data urodzenia w numerze PESEL';
	}

	return null;
}

export default WorkerAddOrder;