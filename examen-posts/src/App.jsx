// App.jsx define el router principal de la aplicación.
// Aquí se asignan las rutas a los componentes correspondientes.
import { BrowserRouter as Router, Routes, Route } from 'react-router' // Importa el router y los componentes necesarios para definir rutas.

import Home from './pages/Home' // Página de bienvenida después del login.
import Login from './pages/Login' // Página de inicio de sesión.
import Products from './pages/Posts' // Página de administración de productos.

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Ruta para la página de login. */}
          <Route path="/" element={<Login />} />
          {/* Ruta para la página principal, solo accesible después de iniciar sesión. */}
          <Route path="/home" element={<Home />} />
          {/* Ruta para la página de productos. */}
          <Route path="/products" element={<Posts />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
