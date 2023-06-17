import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./style/Core.scss"
import { BrowserRouter } from 'react-router-dom'
import "./assets/fontawesome"
import Home from './pages/Home/Home'
import Shop from './pages/Shop/Shop'

const root = ReactDOM.createRoot(
	document.getElementById('root')
);

root.render(
	<BrowserRouter>
		<App />
  	</BrowserRouter>
)