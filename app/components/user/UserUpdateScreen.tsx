// app/components/user/UserUpdateScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  ExitToApp,
  KeyboardReturn,
  Person,
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import type { 
  UserUpdateFormData, 
  UserUpdateValidationErrors,
  UserUpdateData 
} from '~/types/userUpdate';

interface UserUpdateScreenProps {
  formData: UserUpdateFormData;
  errors: UserUpdateValidationErrors;
  loading: boolean;
  message: string | null;
  messageType: 'success' | 'error' | 'info' | null;
  userData: UserUpdateData | null;
  onFormChange: (field: keyof UserUpdateFormData, value: string) => void;
  onFetchUser: () => void;
  onSave: () => void;
  onSaveAndExit: () => void;
  onClear: () => void;
  onExit: () => void;
}

export function UserUpdateScreen({
  formData,
  errors,
  loading,
  message,
  messageType,
  userData,
  onFormChange,
  onFetchUser,
  onSave,
  onSaveAndExit,
  onClear,
  onExit,
}: UserUpdateScreenProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Manejar teclas de función
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3') {
      event.preventDefault();
      onSaveAndExit();
    } else if (event.key === 'F4') {
      event.preventDefault();
      onClear();
    } else if (event.key === 'F5') {
      event.preventDefault();
      onSave();
    } else if (event.key === 'F12' || event.key === 'Escape') {
      event.preventDefault();
      onExit();
    }
  }, [onSaveAndExit, onClear, onSave, onExit]);

  // Manejar envío del formulario de búsqueda
  const handleSearchSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    onFetchUser();
  }, [onFetchUser]);

  // Determinar si el formulario está en modo de edición
  const isEditMode = userData !== null;
  const canSave = isEditMode && formData.firstName && formData.lastName && 
                  formData.password && formData.userType;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CU02"
          programName="COUSR02C"
          title="Update User"
          subtitle="User Security Management"
        />

        <Paper
          elevation={2}
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Update User Information
            </Typography>
          </Box>

          {/* Formulario de búsqueda */}
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body1" fontWeight={600} color="primary.main">
                Enter User ID:
              </Typography>
              
              <TextField
                value={formData.userId}
                onChange={(e) => onFormChange('userId', e.target.value.toUpperCase())}
                placeholder="USER001"
                size="small"
                disabled={loading}
                error={!!errors.userId}
                helperText={errors.userId}
                inputProps={{
                  maxLength: 8,
                  style: { 
                    textAlign: 'center', 
                    fontSize: '1rem', 
                    fontWeight: 600,
                  },
                }}
                sx={{
                  width: 150,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  },
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.userId.trim()}
                startIcon={<SearchIcon />}
                sx={{ fontWeight: 600 }}
              >
                Fetch User
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Separador visual */}
          <Box
            sx={{
              px: 3,
              py: 1,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderTop: `3px solid ${theme.palette.warning.main}`,
              borderBottom: `3px solid ${theme.palette.warning.main}`,
            }}
          >
            <Typography
              variant="body2"
              color="warning.dark"
              fontWeight={600}
              textAlign="center"
            >
              {'*'.repeat(70)}
            </Typography>
          </Box>

          {/* Formulario de edición */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Nombres */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => onFormChange('firstName', e.target.value)}
                  disabled={loading || !isEditMode}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  fullWidth
                  inputProps={{ maxLength: 20 }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: theme.palette.info.main,
                      fontWeight: 600,
                    },
                  }}
                />
                
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => onFormChange('lastName', e.target.value)}
                  disabled={loading || !isEditMode}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  fullWidth
                  inputProps={{ maxLength: 20 }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: theme.palette.info.main,
                      fontWeight: 600,
                    },
                  }}
                />
              </Stack>

              {/* Password y User Type */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  disabled={loading || !isEditMode}
                  error={!!errors.password}
                  helperText={errors.password || '(8 Char)'}
                  inputProps={{ maxLength: 8 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading || !isEditMode}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiInputLabel-root': {
                      color: theme.palette.info.main,
                      fontWeight: 600,
                    },
                  }}
                />
                
                <FormControl 
                  sx={{ flex: 1 }}
                  error={!!errors.userType}
                  disabled={loading || !isEditMode}
                >
                  <InputLabel
                    sx={{
                      color: theme.palette.info.main,
                      fontWeight: 600,
                    }}
                  >
                    User Type
                  </InputLabel>
                  <Select
                    value={formData.userType}
                    onChange={(e) => onFormChange('userType', e.target.value)}
                    label="User Type"
                  >
                    <MenuItem value="">
                      <em>Select Type</em>
                    </MenuItem>
                    <MenuItem value="A">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettings fontSize="small" />
                        A - Admin
                      </Box>
                    </MenuItem>
                    <MenuItem value="U">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        U - User
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.userType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.userType}
                    </Typography>
                  )}
                </FormControl>
              </Stack>

              {/* Información adicional */}
              <Typography variant="body2" color="text.secondary" textAlign="center">
                (A=Admin, U=User)
              </Typography>
            </Stack>
          </Box>

          {/* Mensaje de estado */}
          {message && (
            <Box sx={{ px: 3, pb: 2 }}>
              <Alert 
                severity={messageType || 'info'} 
                sx={{ borderRadius: 2 }}
              >
                {message}
              </Alert>
            </Box>
          )}

          {/* Footer con controles */}
          <Box
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<KeyboardReturn />}
                  onClick={onFetchUser}
                  disabled={loading || !formData.userId.trim()}
                  size="small"
                >
                  ENTER = Fetch
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={onSaveAndExit}
                  disabled={loading || !canSave}
                  color="success"
                  size="small"
                >
                  F3 = Save & Exit
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={onClear}
                  disabled={loading}
                  size="small"
                >
                  F4 = Clear
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={onSave}
                  disabled={loading || !canSave}
                  color="primary"
                  size="small"
                >
                  F5 = Save
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ExitToApp />}
                  onClick={onExit}
                  disabled={loading}
                  size="small"
                >
                  F12 = Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}