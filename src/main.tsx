import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import App from './App.tsx'

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
