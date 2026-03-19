import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext.jsx' 
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Fichar } from './pages/trabajador/Fichar.jsx'
import { Dashboard } from './pages/admin/Dashboard.jsx'
import { Fichajes } from './pages/admin/Fichajes.jsx'
import { Ausencias } from './pages/admin/Ausencias.jsx'
import { Informes } from './pages/admin/Informes.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx' 


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header/>
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Ruta principal: La web del colegio */}
              <Route path="/" element={<Home />} />
              
              {/* Ruta de acceso: El formulario de login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas del sistema (Protegidas por roles) */}
              
              {/* Solo Trabajadores */}
              <Route 
                path="/trabajador/fichar" 
                element={
                  <ProtectedRoute allowedRoles={['trabajador']}>
                    <Fichar />
                  </ProtectedRoute>
                } 
              />

              {/* Solo Administradores */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ausencias" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Ausencias />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/fichajes" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Fichajes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/informes" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Informes />
                  </ProtectedRoute>
                } 
              />

            </Routes>
          </main>
          <Footer/>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App