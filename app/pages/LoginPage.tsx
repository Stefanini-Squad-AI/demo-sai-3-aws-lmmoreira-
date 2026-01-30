import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  CreditCard,
  MenuBook, // ✅ NUEVO: Icono para documentación
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { 
  loginUser, 
  selectAuthLoading, 
  selectAuthError, 
  clearError,
  selectIsAuthenticated,
  selectCurrentUser
} from '~/features/auth/authSlice';
import type { LoginCredentials } from '~/types';

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const [formData, setFormData] = useState<LoginCredentials>({
    userId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const hasRedirected = useRef(false);

  // ✅ NUEVO: Función para abrir documentación
  const handleOpenDocs = useCallback(() => {
    // Abrir en nueva pestaña la documentación
    const docsUrl = `${window.location.origin}${import.meta.env.BASE_URL || '/'}docs/site/index.html`;
    window.open(docsUrl, '_blank', 'noopener,noreferrer');
  }, []);

  // ✅ CORRECCIÓN: Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      console.log('🔄 User already authenticated, redirecting...', { role: user.role });
      
      hasRedirected.current = true;
      
      // Obtener la ruta de destino desde location.state o usar la ruta por defecto
      const from = location.state?.from?.pathname;
      
      // Redirigir según el rol
      const targetPath = from && from !== '/login' 
        ? from 
        : user.role === 'admin' 
          ? '/menu/admin' 
          : '/menu/main';
      
      console.log('🎯 Redirecting to:', targetPath);
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // Resetear el flag cuando el usuario se desautentica
  useEffect(() => {
    if (!isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.userId.trim()) {
      errors.userId = 'Por favor ingrese su ID de usuario.';
    } else if (formData.userId.length > 8) {
      errors.userId = 'El ID de usuario debe tener como máximo 8 caracteres.';
    }

    if (!formData.password.trim()) {
      errors.password = 'Por favor ingrese su contraseña.';
    } else if (formData.password.length > 8) {
      errors.password = 'La contraseña debe tener como máximo 8 caracteres.';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof LoginCredentials) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    if (value.length <= 8) {
      setFormData(prev => ({ ...prev, [field]: value.toUpperCase() }));
      
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: '' }));
      }
      
      if (authError) {
        dispatch(clearError());
      }
    }
  }, [fieldErrors, authError, dispatch]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('🔐 Attempting login with:', { userId: formData.userId });
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log('✅ Login successful, result:', result);
      
    } catch (error) {
      console.error('❌ Login failed:', error);
    }
  }, [formData, validateForm, dispatch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      if (window.confirm('Are you sure you want to exit the system?')) {
        window.close();
      }
    }
  }, []);

  const handleAlertClose = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getErrorMessage = (error: string) => {
    const errorMappings: Record<string, string> = {
      'Invalid credentials': 'Credenciales incorrectas. Intente nuevamente.',
      'User not found': 'Usuario no encontrado. Verifique su ID.',
      'Please check your input': 'Por favor revise su ID de usuario y contraseña.',
      'Network error occurred': 'No se pudo verificar sus credenciales. Revise su conexión.',
    };

    return errorMappings[error] || error;
  };

  // ✅ CORRECCIÓN: No mostrar el formulario si ya está autenticado
  if (isAuthenticated && user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Redirigiendo...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ya ha iniciado sesión. Redirigiendo a su panel.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        {/* ✅ MODIFICADO: SystemHeader con botón de documentación */}
        <Box sx={{ position: 'relative' }}>
          <SystemHeader
            transactionId="CC00"
            programName="COSGN00C"
            title="CardDemo - Aplicación de demostración"
            subtitle="Modernización de mainframes"
            showNavigation={false}
          />
          
          {/* ✅ NUEVO: Botón de documentación discreto en el header */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
            }}
          >
            <Tooltip title="View documentation" arrow>
              <IconButton
                onClick={handleOpenDocs}
                size="small"
                sx={{
                  color: 'text.secondary',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(4px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    borderColor: 'primary.main',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <MenuBook fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          }}
        >
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <CreditCard sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              NATIONAL RESERVE NOTE
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              THE UNITED STATES OF KICSLAND
            </Typography>
            
            {/* ✅ CORRECCIÓN PRINCIPAL: Billete ASCII con espacios preservados */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                lineHeight: 1.2,
                whiteSpace: 'pre',
                textAlign: 'center',
                overflow: 'auto',
                backgroundColor: 'rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {`+========================================+
|%%%%%%%  NATIONAL RESERVE NOTE  %%%%%%%%|
|%(1)  THE UNITED STATES OF KICSLAND (1)%|
|%$$              ___       ********  $$%|
|%$    {x}       (o o)                 $%|
|%$     ******  (  V  )      O N E     $%|
|%(1)          ---m-m---             (1)%|
|%%~~~~~~~~~~~ ONE DOLLAR ~~~~~~~~~~~~~%%|
+========================================+`}
            </Box>
          </Box>

          {/* Resto del componente sin cambios... */}
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h6"
              color="primary.main"
              textAlign="center"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Ingrese su ID de usuario y contraseña y presione ENTER:
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ maxWidth: 400, mx: 'auto' }}
            >
              <Stack spacing={3}>
                <TextField
                  label="ID de usuario"
                  value={formData.userId}
                  onChange={handleInputChange('userId')}
                  error={!!fieldErrors.userId}
                  helperText={fieldErrors.userId || 'Máx. 8 caracteres'}
                  disabled={isLoading}
                  autoFocus
                  inputProps={{
                    maxLength: 8,
                    style: { textTransform: 'uppercase' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password || 'Máx. 8 caracteres'}
                  disabled={isLoading}
                  autoComplete="current-password"
                  inputProps={{
                    maxLength: 8,
                    style: { textTransform: 'uppercase' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                {(authError || Object.keys(fieldErrors).length > 0) && (
                  <>
                    {authError ? (
                      <Alert
                        severity="error"
                        onClose={handleAlertClose}
                        sx={{ borderRadius: 2 }}
                      >
                        {getErrorMessage(authError)}
                      </Alert>
                    ) : (
                    <Alert
                      severity="error"
                      sx={{ borderRadius: 2 }}
                    >
                      Por favor corrija los errores anteriores.
                    </Alert>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: theme.palette.primary.contrastText,
                    border: 'none',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.9)})`,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                    '&:active': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                    },
                    '&:disabled': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.secondary.main, 0.5)})`,
                      color: alpha(theme.palette.primary.contrastText, 0.7),
                    },
                  }}
                >
                  {isLoading ? 'Iniciando sesión...' : 'ENTER = Iniciar sesión'}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Credenciales de ejemplo:
            </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Typography variant="caption" sx={{ 
                  bgcolor: 'warning.main', 
                  color: 'warning.contrastText',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}>
                  Administrador: ADMIN001 / PASSWORD
                </Typography>
                <Typography variant="caption" sx={{ 
                  bgcolor: 'success.main', 
                  color: 'success.contrastText',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}>
                  Usuario de Back-Office: USER001 / PASSWORD
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ENTER = Iniciar sesión • F3 = Salir
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
