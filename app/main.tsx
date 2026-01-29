// app/main.tsx (actualizado)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { enableMocking } from './mocks';
import './styles/global.css';

async function prepare() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  if (useMocks) {
    console.log('🔶 Starting application with MSW mocks');
    await enableMocking();
  } else {
    console.log('🔶 Mocking disabled, using real backend');
  }
}

prepare().then(() => {
  // Obtener el basename desde la variable de entorno de Vite
  const basename = import.meta.env.DEV ? '/' : '/demo-sai-3-aws';
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});