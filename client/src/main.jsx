import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'stream-chat-react/dist/css/v2/index.css'; // Import Stream Chat CSS first
import './index.css' // Global styles override libraries
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
