// app/pages/AccountViewPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountViewScreen } from '~/components/account/AccountViewScreen';
import { useAccountView } from '~/hooks/useAccountView';

export default function AccountViewPage() {
  const navigate = useNavigate();
  const { data, loading, error, searchAccount, initializeScreen } = useAccountView();

  useEffect(() => {
    // Verificar autenticación
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/login');
      return;
    }

    // Inicializar pantalla
    initializeScreen();
  }, [navigate, initializeScreen]);

  const handleExit = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/menu/admin');
    } else {
      navigate('/menu/main');
    }
  };

  return (
    <AccountViewScreen
      onSearch={searchAccount}
      onExit={handleExit}
      data={data}
      loading={loading}
      error={error}
    />
  );
}