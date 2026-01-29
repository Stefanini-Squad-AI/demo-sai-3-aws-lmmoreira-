// app/pages/CreditCardViewPage.tsx (actualizada)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardDetailScreen } from '~/components/creditCard/CreditCardDetailScreen';

export default function CreditCardViewPage() {
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

  return <CreditCardDetailScreen onExit={handleExit} />;
}