import React, { useState } from 'react'
import './App.css'
import {Route, BrowserRouter, Routes} from "react-router-dom";
import CustomerLogin from "../CustomerLogin/CustomerLogin.jsx";
import CustomerOrder from "../CustomerOrder/CustomerOrder.jsx";

import {Container} from "react-bootstrap";


function App() {

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/order" element={<CustomerOrder/>}/>
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

export default App
