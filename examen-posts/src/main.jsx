// main.jsx es el punto de entrada de la aplicación React.
// Aquí se monta el componente principal App dentro del elemento HTML con id 'root'.
import { StrictMode } from 'react' // StrictMode ayuda a detectar problemas en el render y en los efectos.
import { createRoot } from 'react-dom/client' // createRoot es la API moderna para renderizar React en el DOM.
import App from './App.jsx' // Se importa el componente raíz de la aplicación.
import React from 'react'
import ReactDOM from 'reactdom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
