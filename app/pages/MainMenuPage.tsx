import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuScreen } from '~/components/menu/MenuScreen';
import { useMenu } from '~/hooks/useMenu';
import { getMainMenuData } from '~/data/menuData';
import { useAppSelector } from '~/store/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '~/features/auth/authSlice';
import type { MenuData } from '~/types/menu';

export default function MainMenuPage() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    console.log('🔍 MainMenuPage - Checking authentication:', { isAuthenticated, user });
    
    // Check authentication using Redux
    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Allow access to both roles (admin can access main menu)
    console.log('✅ User authorized for main menu');
    setMenuData(getMainMenuData());
  }, [navigate, isAuthenticated, user]);

  const { loading, error, handleOptionSelect, handleExit } = useMenu({
    onError: (error) => console.error('Main menu error:', error),
    onSuccess: (option) => console.log('Option selected:', option.label),
  });

  if (!menuData) {
    return null;
  }

  return (
    <MenuScreen
      menuData={menuData}
      onOptionSelect={handleOptionSelect}
      onExit={handleExit}
      error={error}
      loading={loading}
    />
  );
}