import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../watchlist.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
