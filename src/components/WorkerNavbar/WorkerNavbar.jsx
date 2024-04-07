import {Nav, Navbar as Navb} from 'react-bootstrap';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getWorkerName, getWorkerRole, isWorkerLogger, logoutWorker} from "../../jwtToken.js";
function CustomerNavbar() {
	const [role, setRole] = useState(null);
	const navigate = useNavigate();

	if(role === null && isWorkerLogger() === true) {
		setRole(getWorkerRole());
	}

	useEffect(() => {

	}, [role]);

	return (
		<Navb>
			<Navb.Brand href="/lab">LabAPI dla pracowników</Navb.Brand>
			<Navb.Collapse>
				<Nav className="me-auto">
					{Links(role, navigate)}
				</Nav>
				<Nav>
					{role ?
						(<>
								<Navb.Text>
									{"Zalogowano jako: " + getWorkerName()}
								</Navb.Text>
								<Nav.Link onClick={()=> {
									logoutWorker();
									setRole(null);
									navigate("/lab");
								}}>
									Wyloguj
								</Nav.Link>
						</>
						)
						:
						<Nav.Link href="/lab/login">
							Zaloguj
						</Nav.Link>}
				</Nav>
			</Navb.Collapse>
		</Navb>
	);
}

const Links = (role, navigate) => {
	switch(role) {
		case "LabWorker":
			return (
				<>
					<Nav.Link onClick={()=> navigate("/lab/order")}>Zlecenia</Nav.Link>
					<Nav.Link onClick={()=> navigate("/lab/test")}>Testy</Nav.Link>
				</>
			)
		case "Admin":
			return (
				<>

				</>
			)
	}
}

export default CustomerNavbar;