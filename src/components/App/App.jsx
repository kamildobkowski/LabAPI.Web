import './App.css'
import {Route, BrowserRouter, Routes} from "react-router-dom";
import CustomerLogin from "../CustomerLogin/CustomerLogin.jsx";
import CustomerOrder from "../CustomerOrder/CustomerOrder.jsx";
import CustomerNavbar from "../CustomerNavbar/CustomerNavbar.jsx";
import {Container} from "react-bootstrap";
import WorkerLogin from "../WorkerLogin/WorkerLogin.jsx";
import WorkerNavbar from "../WorkerNavbar/WorkerNavbar.jsx";
import WorkerTestList from "../WorkerTests/WorkerTestList.jsx";
import WorkerTestDetails from "../WorkerTestDetails/WorkerTestDetails.jsx";
import WorkerAddTest from "../WorkerAddTest/WorkerAddTest.jsx";
import WorkerOrders from "../WorkerOrders/WorkerOrders.jsx";
import WorkerAddOrder from "../WorkerAddOrder/WorkerAddOrder.jsx";
import WorkerOrderDetails from "../WorkerOrderDetails/WorkerOrderDetails.jsx";
import NotFound from "../ErrorPages/NotFound.jsx";
import Forbidden from "../ErrorPages/Forbidden.jsx";

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
    <Route path="/404" element={<NotFound/>}/>
    <Route path="/403" element={<Forbidden/>}/>
  </Routes>
}

const WorkerRoutes = () => {
  return <Routes>
    <Route path="/login" element={<WorkerLogin/>}/>
    <Route path="/test" element={<WorkerTestList/>}/>
    <Route path="/test/add" element={<WorkerAddTest/>}/>
    <Route path="/test/edit/:id" element={<WorkerTestDetails/>}/>
    <Route path="/order" element={<WorkerOrders/>}/>
    <Route path="/order/add" element={<WorkerAddOrder/>}/>
    <Route path="/order/details/:orderNumber" element={<WorkerOrderDetails/>}/>
    <Route path="/404" element={<NotFound/>}/>
    <Route path="/403" element={<Forbidden/>}/>
  </Routes>
}

export default App
