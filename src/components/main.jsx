import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App.jsx'
import './index.css'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';

axios.defaults.baseURL='http://localhost:5002/api'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
