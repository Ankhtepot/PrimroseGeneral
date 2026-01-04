import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import AdministrationProvider from "./store/administration-context";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AdministrationProvider>
          <App />
      </AdministrationProvider>
  </StrictMode>,
)
