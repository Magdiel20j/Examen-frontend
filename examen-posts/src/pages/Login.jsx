// Login.jsx contiene la pantalla de inicio de sesión.
// Para este ejemplo se usa un usuario fijo en memoria y se crea un token falso.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

// Lista de usuarios válidos usados solo para la demo del login.
// Esta lista no viene de ninguna API; es solo un conjunto de credenciales locales.
const users = [
  {
    id: 1,
    email: 'john@gmail.com',
    username: 'johnd',
    password: 'm38rmF$'
  },
  {
    id: 2,
    email: 'morrison@gmail.com',
    username: 'mor_2314',
    password: '83r5^_'
  },
  {
    id: 3,
    email: 'kevin@gmail.com',
    username: 'kevinryan',
    password: 'kev02937@'
  }
]

const Login = () => {
  // Estados para controlar los campos del formulario y su comportamiento.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Si ya existe un token, el usuario ya está autenticado.
    // Entonces redirige directamente a la página de inicio.
    const token = localStorage.getItem('fakestore_token') || sessionStorage.getItem('fakestore_token')
    if (token) {
      navigate('/home')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    // Validación simple de los campos antes de continuar.
    if (!email.trim() || !password) {
      setError('Por favor completa email y contraseña.')
      return
    }

    setLoading(true)

    try {
      // Busca en la lista local de usuarios el email y contraseña ingresados.
      const user = users.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
      )

      if (!user) {
        // Si no existe, se lanza un error y se muestra al usuario.
        throw new Error('Email o contraseña incorrectos.')
      }

      // Se genera un token falso para simular autenticación.
      const token = `token-${user.id}-${Date.now()}`
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('fakestore_token', token)
      storage.setItem('fakestore_user', user.username)
      storage.setItem('fakestore_email', user.email)

      // Redirige a la página de inicio luego de iniciar sesión.
      navigate('/home')
    } catch (error_) {
      setError(error_.message || 'Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 md:flex-row md:items-center">
        <div className="w-full">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Inicia sesión</h1>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Guardar sesión
              </label>
              <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
