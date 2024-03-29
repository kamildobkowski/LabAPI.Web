import {Button, Nav, Navbar as Navb} from 'react-bootstrap';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
function CustomerNavbar() {
	const [logged, setLogged] = useState(false);
	const navigate = useNavigate();

	if(logged === false && localStorage.getItem("token") !== null) {
		setLogged(true);
	}
	useEffect(() => {

	}, [logged]);

	return (
		<Navb>
			<Navb.Brand href="/">LabAPI</Navb.Brand>
			<Navb.Collapse>
				<Nav className="me-auto">
					<Button variant="outline-success" onClick={()=> navigate("/order")}>Pobierz swoje wyniki</Button>

				</Nav>
				<Nav>
					<Nav.Link onClick={()=> navigate("/contact")}>Kontakt</Nav.Link>
					{logged ?
						<Nav.Link onClick={()=> {
						localStorage.removeItem("token");
						setLogged(false);
						navigate("/");
						}}>
							Wyloguj
						</Nav.Link>
						:
						<Nav.Link href="/login">
							Zaloguj
						</Nav.Link>}
				</Nav>
			</Navb.Collapse>
		</Navb>
	);
}

export default CustomerNavbar;