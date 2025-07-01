import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AlertProvider } from './context/AlertContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </StrictMode>,
)
