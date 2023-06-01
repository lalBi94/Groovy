import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./style/Core.scss"
import { BrowserRouter } from 'react-router-dom'
import "./assets/fontawesome"
import proxyConfig from './proxy.js';

proxyConfig(App)

const root = ReactDOM.createRoot(
	document.getElementById('root')
);

root.render(
	<BrowserRouter>
		<App />
  	</BrowserRouter>
)