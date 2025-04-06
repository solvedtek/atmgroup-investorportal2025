import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'; // Import AuthProvider
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap BrowserRouter with AuthProvider */}
      <BrowserRouter> {/* Wrap App with BrowserRouter */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
