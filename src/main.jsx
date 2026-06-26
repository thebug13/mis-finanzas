import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MovimientosProvider } from './contexts/MovimientosContext';
import { BolsillosProvider } from './contexts/BolsillosContext';
import { SuscripcionesProvider } from './contexts/SuscripcionesContext';
import { NotificacionesProvider } from './contexts/NotificacionesContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <AuthProvider>
          <MovimientosProvider>
            <BolsillosProvider>
              <SuscripcionesProvider>
                <NotificacionesProvider>
                  <App />
                </NotificacionesProvider>
              </SuscripcionesProvider>
            </BolsillosProvider>
          </MovimientosProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
