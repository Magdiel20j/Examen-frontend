import {Link} from  'react-router'

// Products.jsx muestra la lista de productos y permite crear, editar y eliminar productos.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Nav from '../Components/Nav.jsx'
import ProductForm from '../components/ProductForm'
import ConfirmModal from '../components/ConfirmModal'

const Products = () => {
  // Estados que controla la lista de productos y su carga.
  const [Posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const navigate = useNavigate()
  const token = localStorage.getItem('fakestore_token') || sessionStorage.getItem('fakestore_token')

  // Filtra productos según el texto de búsqueda en título, descripción o categoría.
  const filteredPosts = Posts.filter((Posts) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return [Posts.title, Posts.description, Posts.category]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })

  // Cálculos de paginación.
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    // Si no hay token válido, redirige al login.
    if (!token) {
      navigate('/')
      return
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) {
          throw new Error('Error al cargar los productos')
        }

        const data = await response.json()
        // Agrega la propiedad source para distinguir productos de la API de los locales.
        setPosts(data.map((Posts) => ({ ...Posts, source: 'api' })))
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/categories')
        if (!response.ok) {
          throw new Error('Error al cargar las categorías')
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.warn(err)
      }
    }

    fetchPosts()
    fetchCategories()
  }, [navigate, token])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleEditPosts = async (PostsId) => {
    setPostsError('')
    setLoadingPostsDetail(true)

    const localPosts = Posts.find((Posts) => Posts.id === PostsId)
    // Si el producto ya está en el estado local, no vuelve a pedirlo a la API.
    if (localPosts) {
      setEditingPosts(Posts)
      setShowPostsForm(true)
      setLoadingPostsDetail(false)
      return
    }

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts${PostsId}`)
      if (!response.ok) {
        throw new Error('Error al cargar el producto')
      }

      const data = await response.json()
      setEditingPosts({ ...data, source: 'api' })
      setShowPostsForm(true)
    } catch (err) {
      setPostsError(err.message || 'No se pudo cargar el producto')
    } finally {
      setLoadingPostsDetail(false)
    }
  }

  const handleUpdatePosts = async (formData) => {
    setPostsError('')
    setPostsSuccess('')
    setPostsSubmitting(true)

    const isLocalPosts = editingPosts?.source !== 'api'

    try {
      if (isLocalProduct) {
        // Actualiza directamente el producto local sin llamar a la API.
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editinPosts.id ? { ...p, ...formData, source: p.source || 'local' } : p
          )
        )
        setPostsSuccess('Producto actualizado correctamente.')
        setShowPostsForm(false)
        setEditingPosts(null)
        return
      }

      const response = await fetch(`https://jsonplaceholder.typicode.com/Posts/${editingPosts.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error actualizando producto')
      }

      const data = await response.json()
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPosts.id ? { ...data, source: 'api' } : p))
      )
      setPostsSuccess('Producto actualizado correctamente.')
      setShowPostsForm(false)
      setEditingPosts(null)
      console.log('fakestore updated product:', data)
    } catch (err) {
      setPostsError(err.message || 'No se pudo actualizar el producto')
    } finally {
      setPostsSubmitting(false)
    }
  }

  const handleDeletePosts = async (PostsId) => {
    setPostsToDelete(PostsId)
    setShowDeleteConfirm(true)
  }

  const confirmDeletePosts = async () => {
    if (!PostsToDelete) return

    setPostsError('')
    setPostsSuccess('')
    setShowDeleteConfirm(false)

    try {
      const Posts = Posts.find((p) => p.id === PostsToDelete)
      if (Posts?.source !== 'api') {
        // Si el producto es local, simplemente lo eliminamos del estado.
        setPosts((prev) => prev.filter((p) => p.id !== PostsToDelete))
        setPostsSuccess('Producto eliminado correctamente.')
        setPostsToDelete(null)
        return
      }

      const response = await fetch(`https://jsonplaceholder.typicode.com/Posts/${PostsToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error eliminando producto')
      }

      setPosts((prev) => prev.filter((p) => p.id !== PostsToDelete))
      setPostsSuccess('Producto eliminado correctamente.')
      setPostsToDelete(null)
    } catch (err) {
      setPostsError(err.message || 'No se pudo eliminar el producto')
      setPostsToDelete(null)
    }
  }

  const cancelDeletePosts = () => {
    setShowDeleteConfirm(false)
    setPostsToDelete(null)
  }

  const [showPostsForm, setShowPostsForm] = useState(false)
  const [PostsSubmitting, setPostsSubmitting] = useState(false)
  const [PostsError, setPostsError] = useState('')
  const [PostsSuccess, setPostsSuccess] = useState('')
  const [editingPosts, setEditingPosts] = useState(null)
  const [loadingPostsDetail, setLoadingPostsDetail] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [PostsToDelete, setPostsToDelete] = useState(null)

  const handleCreatePosts = async (formData) => {
    setPostsError('')
    setPostsSuccess('')
    setPostsSubmitting(true)

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/Posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error creando producto')
      }

      const data = await response.json()
      const newPosts = { ...data, source: 'local' }
      setPosts((prev) => [newPosts, ...(prev || [])])
      setPostsSuccess('Producto creado correctamente. ID: ' + (newPosts.id || '—'))
      setShowPostsForm(false)
      setEditingPosts(null)
      setCurrentPage(1)
    } catch (err) {
      setPostsError(err.message || 'No se pudo crear el producto')
    } finally {
      setPostsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {token && <Nav />}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Posts</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Total Posts</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{filteredPosts.length}</p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPosts(null)
                    setShowPostsForm((s) => !s)
                  }}
                  className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Nuevo Posts
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <label htmlFor="Posts-search" className="sr-only">Buscar Posts</label>
            <input
              id="Posts-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por título, descripción o categoría"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        {PostsError && <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-rose-700">{productError}</div>}
        {PostsSuccess && <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">{productSuccess}</div>}

        {showPostsForm && (
          <PostsForm
            initialData={editingPosts || {}}
            categories={categories}
            onSubmit={editingPosts ? handleUpdatePosts : handleCreatePosts}
            submitting={PostsSubmitting || loadingPostsDetail}
            onClose={() => {
              setShowPostsForm(false)
              setEditingPosts(null)
            }}
          />
        )}

        <ConfirmModal
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
          isOpen={showDeleteConfirm}
          isDangerous={true}
          onConfirm={confirmDeletePosts}
          onCancel={cancelDeletePosts}
        />

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-100">
            <h2 className="text-lg font-medium text-slate-900">Catálogo</h2>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-500">Cargando Posts...</div>
            ) : error ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-6 text-rose-700">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">titulo</th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Email</th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Descripción</th>
                      
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {currentPosts.map((Posts) => (
                      <tr key={Posts.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 align-top text-sm text-slate-700 max-w-xl wrap-break-word">{Posts.title}</td>
                        <td className="px-6 py-4 align-top text-sm font-semibold text-slate-900">${Posts.price.toFixed(2)}</td>
                        <td className="px-6 py-4 align-top text-sm text-slate-600 max-w-2xl wrap-break-word">{Posts.description}</td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{Posts.category}</span>
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPosts(Posts.id)}
                              disabled={loadingPostsDetail}
                              className="rounded-full w-full bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                              Editar Posts
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePosts(Posts.id)}
                              className="rounded-full w-full bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                            >
                              Eliminar Posts
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    Página {currentPage} de {totalPages}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Anterior
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Posts
