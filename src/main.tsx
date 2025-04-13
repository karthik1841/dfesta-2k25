import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Using non-null assertion operator (!) since we know 'root' exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
