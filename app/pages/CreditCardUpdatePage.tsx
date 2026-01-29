// app/pages/CreditCardUpdatePage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardUpdateScreen } from '~/components/creditCard/CreditCardUpdateScreen';

export default function CreditCardUpdatePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleExit = () => {
    // Regresar a la lista de tarjetas (como en el COBOL original)
    navigate('/cards/list');
  };

  return <CreditCardUpdateScreen onExit={handleExit} />;
}