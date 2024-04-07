import './App.css'
import {Route, BrowserRouter, Routes} from "react-router-dom";
import CustomerLogin from "../CustomerLogin/CustomerLogin.jsx";
import CustomerOrder from "../CustomerOrder/CustomerOrder.jsx";
import CustomerNavbar from "../CustomerNavbar/CustomerNavbar.jsx";
import {Container} from "react-bootstrap";
import WorkerLogin from "../WorkerLogin/WorkerLogin.jsx";
import WorkerNavbar from "../WorkerNavbar/WorkerNavbar.jsx";
import WorkerTestList from "../WorkerTests/WorkerTestList.jsx";

function App() {

  return (
    <Container>
      <BrowserRouter>
        {location.pathname.startsWith('/lab') ? <WorkerNavbar/> : <CustomerNavbar/>}
        <Routes>
          <Route path="/lab/*" element={<WorkerRoutes/>} />
          <Route path="/*" element={<CustomerRoutes/>}/>
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

const CustomerRoutes = () => {
  return <Routes>
    <Route path="/login" element={<CustomerLogin />} />
    <Route path="/order" element={<CustomerOrder/>}/>
  </Routes>
}

const WorkerRoutes = () => {
  return <Routes>
    <Route path="/login" element={<WorkerLogin/>}/>
    <Route path="/test" element={<WorkerTestList/>}/>
    {/*<Route path="/test/:id" element={<WorkerTestDetails/>}/>*/}
  </Routes>
}

export default App
