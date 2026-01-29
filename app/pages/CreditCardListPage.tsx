// app/pages/CreditCardListPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardListScreen } from '~/components/creditCard/CreditCardListScreen';

export default function CreditCardListPage() {
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
    navigate('/menu/main');
  };

  return <CreditCardListScreen onExit={handleExit} />;
}