import React, { useState } from 'react'
import './App.css'
import {Route, BrowserRouter, Routes} from "react-router-dom";
import CustomerLogin from "../CustomerLogin/CustomerLogin.jsx";


function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<CustomerLogin />} />
    </Routes>
  </BrowserRouter>
}

export default App
