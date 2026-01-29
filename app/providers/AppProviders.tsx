import React, { createContext, useContext, useState, useEffect } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { store } from "~/store/store";
import { lightTheme, darkTheme } from "~/theme/theme";
import { validateToken } from "~/features/auth/authSlice";

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppProviders');
  }
  return context;
};

interface AppProvidersProps {
  children: React.ReactNode;
}

// Componente interno que tiene acceso al dispatch de Redux
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Inicializar autenticación al cargar la aplicación
    const initAuth = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        console.log('🔄 Initializing auth with existing token...');
        try {
          await dispatch(validateToken() as any);
          console.log('✅ Auth initialized successfully');
        } catch (error) {
          console.error('❌ Auth initialization failed:', error);
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch]);

  // Mostrar children solo después de inicializar
  // (o inmediatamente si no hay token)
  if (!isInitialized) {
    return null; // O un loading spinner si prefieres
  }

  return <>{children}</>;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      return (saved as ThemeMode) || 'system';
    }
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
      } else {
        setIsDarkMode(themeMode === 'dark');
      }
    };

    updateTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setThemeModeHandler = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const themeContextValue: ThemeContextType = {
    mode: themeMode,
    toggleTheme,
    setThemeMode: setThemeModeHandler,
  };

  return (
    <ReduxProvider store={store}>
      <AuthInitializer>
        <ThemeContext.Provider value={themeContextValue}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ThemeContext.Provider>
      </AuthInitializer>
    </ReduxProvider>
  );
}