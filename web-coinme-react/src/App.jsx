import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext.jsx' 
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Fichar } from './pages/trabajador/Fichar.jsx'
import { Dashboard } from './pages/admin/Dashboard.jsx'

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
              
              {/* Rutas del sistema (se activan tras el login) */}
              <Route path="/trabajador/fichar" element={<Fichar />} />
              <Route path="/admin/ausencias" element={<Ausencias />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/fichajes" element={<Fichajes />} />
              <Route path="/admin/informes" element={<Informes />} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App