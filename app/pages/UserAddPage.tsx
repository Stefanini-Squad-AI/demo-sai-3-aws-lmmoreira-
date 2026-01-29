// app/pages/UserAddPage.tsx
import { UserAddScreen } from '~/components/user/UserAddScreen';
import { useAppSelector } from '~/store/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '~/features/auth/authSlice';
import { Navigate } from 'react-router-dom';

export default function UserAddPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  // Verificar autenticación y permisos de admin
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/menu/main" replace />;
  }

  return (
    <UserAddScreen
      onSuccess={(message) => {
        console.log('✅ User added successfully:', message);
      }}
      onError={(error) => {
        console.error('❌ Error adding user:', error);
      }}
    />
  );
}