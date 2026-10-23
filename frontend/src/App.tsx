
import { lazy, Suspense } from 'react'

import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom'

import './App.css'

// =========================================
// CARREGAMENTO SOB DEMANDA DAS PÁGINAS
// =========================================

// Cada página será carregada somente
// quando sua rota for acessada.
const Simulacao = lazy(
  () => import('./pages/Simulacao')
)

const Dashboard = lazy(
  () => import('./pages/Dashboard')
)

// =========================================
// INDICADOR DE CARREGAMENTO
// =========================================

function CarregandoPagina() {
  return (
    <section
      className="card pagina-carregamento"
      role="status"
      aria-live="polite"
    >
      <div className="pagina-carregamento-conteudo">
        <span
          className="dashboard-spinner"
          aria-hidden="true"
        />

        <p>Carregando página...</p>
      </div>
    </section>
  )
}

// =========================================
// APLICAÇÃO PRINCIPAL
// =========================================

function App() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Simulação de Crédito</h1>

          <p>
            Análise de risco para concessão de crédito
          </p>
        </header>

        <nav className="navigation">
          <NavLink
            to="/simulacao"
            className={({ isActive }) =>
              isActive
                ? 'navigation-link active'
                : 'navigation-link'
            }
          >
            Simulação
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'navigation-link active'
                : 'navigation-link'
            }
          >
            Dashboard
          </NavLink>
        </nav>

        <Suspense fallback={<CarregandoPagina />}>
          <Routes>
            <Route
              path="/simulacao"
              element={<Simulacao />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/simulacao"
                  replace
                />
              }
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
