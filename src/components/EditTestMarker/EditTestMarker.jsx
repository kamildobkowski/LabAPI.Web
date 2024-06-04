/* eslint-disable react/prop-types */
import {Accordion, Button, Form, FormGroup, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";

function EditTestMarker({ test, setTest }) {
	const [newMarker, setNewMarker] = useState({name: "", shortName: "", unit: "", lowerNorm: "", higherNorm: ""});
	const [showModal, setShowModal] = useState(false);
	const [errors, setErrors] = useState({});

	useEffect(() => {

	}, [errors]);

	const handleAddMarker = () => {
		console.log(newMarker);
		if(!validate()) {
			return;
		}
		setTest({...test, markers: [...test.markers, newMarker]});
		setNewMarker({name: "", shortName: "", unit: "", lowerNorm: "", higherNorm: ""});
		setShowModal(false);
	};

	const validate = () => {
		let errorList = {};
		if(!newMarker.name || newMarker.name === '') {
			errorList.name = 'Nazwa jest wymagana';
		}
		if(!!newMarker.shortName && newMarker.shortName.length < 2) {
			errorList.shortName = 'Skrót musi mieć co najmniej 2 znaki';
		}
		setErrors({...errorList});
		return Object.keys(errorList).length === 0;
	}

	return <>
		<Accordion>
			{test.markers.map(m => {
				return (
					<Accordion.Item key={m.shortName} eventKey={m.shortName}>
						<Accordion.Header>{m.name}</Accordion.Header>
						<Accordion.Body>
							<FormGroup key={m.shortName}>
								<Form.Label>Nazwa</Form.Label>
								<Form.Control defaultValue={m.name} onChange={r => {
									test.markers.find(x => x.shortName === m.shortName).name = r.target.value;
								}}></Form.Control>
								<Form.Label>Skrót</Form.Label>
								<Form.Control defaultValue={m.shortName} onChange={r => {
									test.markers.find(x => x.shortName === m.shortName).shortName = r.target.value;
								}}/>
								<Form.Label>Jednostka</Form.Label>
								<Form.Control defaultValue={m.unit} onChange={r => {
									test.markers.find(x => x.shortName === m.shortName).unit = r.target.value;
								}}/>
								<Form.Label>Dolna norma</Form.Label>
								<Form.Control defaultValue={m.lowerNorm} onChange={r => {
									test.markers.find(x => x.shortName === m.shortName).lowerNorm = r.target.value;
								}}/>
								<Form.Label>Górna norma</Form.Label>
								<Form.Control defaultValue={m.higherNorm} onChange={r => {
									test.markers.find(x => x.shortName === m.shortName).higherNorm = r.target.value;
								}}/>
							</FormGroup>
							<Button variant={"danger"} onClick={() => {
								test.markers = test.markers.filter(x => x.shortName !== m.shortName);
								setTest({...test});
							}}>
								Usuń
							</Button>
						</Accordion.Body>
					</Accordion.Item>
				)
			})}
		</Accordion>
		<Button variant="success" onClick={() => setShowModal(true)}>Dodaj marker</Button>

		<Modal show={showModal} onHide={() => setShowModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Dodaj marker</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormGroup>
					<Form.Label>Nazwa</Form.Label>
					<Form.Control value={newMarker.name} onChange={e => setNewMarker({...newMarker, name: e.target.value})} isInvalid={!!errors.name}/>
					<Form.Control.Feedback type="invalid" hidden={!errors.name}>{errors.name}</Form.Control.Feedback>
					<Form.Label>Skrót</Form.Label>
					<Form.Control value={newMarker.shortName} onChange={e => setNewMarker({...newMarker, shortName: e.target.value})} isInvalid={!!errors.shortName}/>
					<Form.Control.Feedback type="invalid" hidden={!errors.shortName}>{errors.shortName}</Form.Control.Feedback>
					<Form.Label>Jednostka</Form.Label>
					<Form.Control value={newMarker.unit} onChange={e => setNewMarker({...newMarker, unit: e.target.value})}/>
					<Form.Label>Dolna norma</Form.Label>
					<Form.Control value={newMarker.lowerNorm} onChange={e => setNewMarker({...newMarker, lowerNorm: e.target.value})}/>
					<Form.Label>Górna norma</Form.Label>
					<Form.Control value={newMarker.higherNorm} onChange={e => setNewMarker({...newMarker, higherNorm: e.target.value})}/>
					</FormGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => setShowModal(false)}>Zamknij</Button>
				<Button variant="primary" onClick={handleAddMarker}>Dodaj marker</Button>
			</Modal.Footer>
		</Modal>
	</>
}

export default EditTestMarker;