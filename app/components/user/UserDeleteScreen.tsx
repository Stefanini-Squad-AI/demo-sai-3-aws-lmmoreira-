// app/components/user/UserDeleteScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  ExitToApp,
  KeyboardReturn,
  Person,
  AdminPanelSettings,
  Warning,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import type { 
  UserDeleteFormData, 
  UserDeleteValidationErrors,
  UserDeleteData 
} from '~/types/userDelete';

interface UserDeleteScreenProps {
  formData: UserDeleteFormData;
  errors: UserDeleteValidationErrors;
  loading: boolean;
  message: string | null;
  messageType: 'success' | 'error' | 'info' | null;
  userData: UserDeleteData | null;
  onFormChange: (field: keyof UserDeleteFormData, value: string) => void;
  onFetchUser: () => void;
  onDelete: () => void;
  onClear: () => void;
  onExit: () => void;
}

export function UserDeleteScreen({
  formData,
  errors,
  loading,
  message,
  messageType,
  userData,
  onFormChange,
  onFetchUser,
  onDelete,
  onClear,
  onExit,
}: UserDeleteScreenProps) {
  const theme = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Manejar teclas de función
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit();
    } else if (event.key === 'F4') {
      event.preventDefault();
      onClear();
    } else if (event.key === 'F5') {
      event.preventDefault();
      if (userData) {
        setShowConfirmDialog(true);
      }
    } else if (event.key === 'F12') {
      event.preventDefault();
      onExit();
    }
  }, [onExit, onClear, userData]);

  // Manejar envío del formulario de búsqueda
  const handleSearchSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    onFetchUser();
  }, [onFetchUser]);

  // Manejar confirmación de eliminación
  const handleConfirmDelete = useCallback(() => {
    setShowConfirmDialog(false);
    onDelete();
  }, [onDelete]);

  // Determinar si se puede eliminar
  const canDelete = userData !== null;

  // Función auxiliar para obtener etiqueta del tipo de usuario
  const getUserTypeLabel = (userType: 'A' | 'U') => {
    return userType === 'A' ? 'Admin' : 'User';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CU03"
          programName="COUSR03C"
          title="Delete User"
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
              background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
              Delete User Information
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

          {/* Información del usuario (solo lectura) */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* First Name */}
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="info.main"
                  gutterBottom
                >
                  First Name:
                </Typography>
                <TextField
                  value={userData?.firstName || ''}
                  disabled
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                    '& .MuiOutlinedInput-root.Mui-disabled': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>

              {/* Last Name */}
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="info.main"
                  gutterBottom
                >
                  Last Name:
                </Typography>
                <TextField
                  value={userData?.lastName || ''}
                  disabled
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                    '& .MuiOutlinedInput-root.Mui-disabled': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>

              {/* User Type */}
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="info.main"
                  gutterBottom
                >
                  User Type:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    value={userData?.userType || ''}
                    disabled
                    sx={{
                      width: 80,
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: theme.palette.primary.main,
                        fontWeight: 600,
                        textAlign: 'center',
                      },
                      '& .MuiOutlinedInput-root.Mui-disabled': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                  {userData && (
                    <Chip
                      label={getUserTypeLabel(userData.userType)}
                      size="small"
                      color={userData.userType === 'A' ? 'error' : 'primary'}
                      icon={userData.userType === 'A' ? <AdminPanelSettings /> : <Person />}
                      variant="outlined"
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    (A=Admin, U=User)
                  </Typography>
                </Box>
              </Box>
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
                  startIcon={<DeleteIcon />}
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={loading || !canDelete}
                  color="error"
                  size="small"
                >
                  F5 = Delete
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
                  variant="outlined"
                  startIcon={<ExitToApp />}
                  onClick={onExit}
                  disabled={loading}
                  size="small"
                >
                  F3 = Back
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {/* Dialog de confirmación */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Confirm User Deletion
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the following user?
            </Typography>
            {userData && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2"><strong>User ID:</strong> {userData.userId}</Typography>
                <Typography variant="body2"><strong>Name:</strong> {userData.firstName} {userData.lastName}</Typography>
                <Typography variant="body2"><strong>Type:</strong> {getUserTypeLabel(userData.userType)}</Typography>
              </Box>
            )}
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              <strong>Warning:</strong> This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowConfirmDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete User
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}