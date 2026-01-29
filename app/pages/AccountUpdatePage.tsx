// app/pages/AccountUpdatePage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountUpdateScreen } from '~/components/account/AccountUpdateScreen';
import { useAccountUpdate } from '~/hooks/useAccountUpdate';

export default function AccountUpdatePage() {
  const navigate = useNavigate();
  const {
    accountData,
    hasChanges,
    searchAccount,
    updateAccount,
    updateLocalData,
    resetForm,
    clearData,
    loading,
    error,
  } = useAccountUpdate();

  useEffect(() => {
    // Verificar autenticación
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/login');
      return;
    }

    // Limpiar datos al montar
    clearData();
  }, [navigate, clearData]);

  const handleExit = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/menu/admin');
    } else {
      navigate('/menu/main');
    }
  };

  return (
    <AccountUpdateScreen
      onSearch={searchAccount}
      onUpdate={updateAccount}
      onExit={handleExit}
      accountData={accountData}
      hasChanges={hasChanges}
      loading={loading}
      error={error}
      onDataChange={updateLocalData}
      onReset={resetForm}
    />
  );
}