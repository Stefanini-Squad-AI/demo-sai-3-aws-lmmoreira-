// app/components/user/UserAddScreen.tsx (corregir imports y tipos)
import React, { useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  useTheme,
  alpha,
  InputAdornment,
  Chip,
  IconButton, // ✅ CORRECCIÓN: Importar desde @mui/material
} from '@mui/material';
import {
  Person,
  Badge,
  Lock,
  AdminPanelSettings,
  Group,
  Save,
  Clear,
  ArrowBack,
  ExitToApp,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { useUserAdd } from '~/hooks/useUserAdd';
import type { UserAddFormData } from '~/types/userAdd';

interface UserAddScreenProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function UserAddScreen({ onSuccess, onError }: UserAddScreenProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {
    formData,
    validationErrors,
    successMessage,
    loading,
    error,
    handleFieldChange,
    handleSubmit,
    clearForm,
    handleBack,
    handleExit,
  } = useUserAdd({
    onSuccess: (response) => {
      onSuccess?.(response.message);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  // Manejar envío del formulario
  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit();
  }, [handleSubmit]);

  // Manejar teclas de función
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3') {
      event.preventDefault();
      handleBack();
    } else if (event.key === 'F4') {
      event.preventDefault();
      clearForm();
    } else if (event.key === 'F12') {
      event.preventDefault();
      handleExit();
    }
  }, [handleBack, clearForm, handleExit]);

  // ✅ CORRECCIÓN: Crear campo de texto reutilizable con tipos correctos
  const renderTextField = (
    field: keyof UserAddFormData,
    label: string,
    placeholder: string = '', // ✅ Valor por defecto para evitar undefined
    icon?: React.ReactNode,
    type: string = 'text'
  ) => (
    <TextField
      label={label}
      value={formData[field]}
      onChange={(e) => handleFieldChange(field, e.target.value)}
      error={!!validationErrors[field]}
      helperText={validationErrors[field] || `(${field === 'userId' || field === 'password' ? '8' : '20'} Char)`}
      disabled={loading}
      placeholder={placeholder}
      type={type}
      autoComplete="off"
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ) : undefined,
        endAdornment: field === 'password' ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              disabled={loading}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          },
        },
      }}
    />
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CU01"
          programName="COUSR01C"
          title="CardDemo - User Administration"
          subtitle="Add New User to System"
        />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Add User
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Create New System User Account
            </Typography>
          </Box>

          {/* Formulario */}
          <Box sx={{ p: 4 }}>
            <Box
              component="form"
              onSubmit={handleFormSubmit}
              sx={{ maxWidth: 800, mx: 'auto' }}
            >
              <Grid container spacing={3}>
                {/* Nombre y Apellido */}
                <Grid item xs={12} md={6}>
                  {renderTextField(
                    'firstName',
                    'First Name',
                    'Enter first name',
                    <Person color="primary" />
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {renderTextField(
                    'lastName',
                    'Last Name',
                    'Enter last name',
                    <Badge color="primary" />
                  )}
                </Grid>

                {/* User ID y Password */}
                <Grid item xs={12} md={6}>
                  {renderTextField(
                    'userId',
                    'User ID',
                    'Enter user ID',
                    <Person color="primary" />
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {renderTextField(
                    'password',
                    'Password',
                    'Enter password',
                    <Lock color="primary" />,
                    showPassword ? 'text' : 'password'
                  )}
                </Grid>

                {/* Tipo de Usuario */}
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={!!validationErrors.userType}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={formData.userType}
                      onChange={(e) => handleFieldChange('userType', e.target.value)}
                      label="User Type"
                      startAdornment={
                        <InputAdornment position="start">
                          <Group color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="A">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AdminPanelSettings fontSize="small" />
                          <span>A - Administrator</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value="U">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          <span>U - Regular User</span>
                        </Box>
                      </MenuItem>
                    </Select>
                    {validationErrors.userType && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {validationErrors.userType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Información adicional */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      User Type Information:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label="A = Admin"
                        size="small"
                        color="warning"
                        variant="outlined"
                        icon={<AdminPanelSettings />}
                      />
                      <Chip
                        label="U = User"
                        size="small"
                        color="info"
                        variant="outlined"
                        icon={<Person />}
                      />
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              {/* Mensajes */}
              {(error || successMessage) && (
                <Box sx={{ mt: 3 }}>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{ borderRadius: 2, mb: 2 }}
                    >
                      {error}
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert
                      severity="success"
                      sx={{ borderRadius: 2 }}
                    >
                      {successMessage}
                    </Alert>
                  )}
                </Box>
              )}

              {/* Botones de Acción */}
              <Box sx={{ mt: 4 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Save />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Adding User...' : 'ENTER = Add User'}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={clearForm}
                    disabled={loading}
                    startIcon={<Clear />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    F4 = Clear
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleBack}
                    disabled={loading}
                    startIcon={<ArrowBack />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    F3 = Back
                  </Button>

                  <Button
                    variant="text"
                    size="large"
                    onClick={handleExit}
                    disabled={loading}
                    startIcon={<ExitToApp />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    F12 = Exit
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Footer con instrucciones */}
          <Divider />
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ENTER = Add User • F3 = Back • F4 = Clear • F12 = Exit
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}