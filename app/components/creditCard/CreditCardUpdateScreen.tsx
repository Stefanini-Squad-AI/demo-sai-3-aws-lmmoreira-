// app/components/creditCard/CreditCardUpdateScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Collapse,
} from '@mui/material';
import {
  Search,
  ExitToApp,
  CreditCard,
  Person,
  CalendarToday,
  Save,
  Cancel,
  Edit,
  CheckCircle,
  Warning,
  Info,
  KeyboardReturn,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useCreditCardUpdate } from '~/hooks/useCreditCardUpdate';

interface CreditCardUpdateScreenProps {
  onExit?: () => void;
}

interface LocationState {
  accountNumber?: string;
  cardNumber?: string;
  fromList?: boolean;
}

export function CreditCardUpdateScreen({ onExit }: CreditCardUpdateScreenProps) {
  const theme = useTheme();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [searchForm, setSearchForm] = useState({
    accountId: state?.accountNumber || '',
    cardNumber: state?.cardNumber || '',
  });
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showTestData, setShowTestData] = useState(false);

  // Datos de prueba para desarrollo
  const testData = [
    {
      accountId: '12345678901',
      cardNumber: '4532123456789012',
      description: 'Active Card - John Smith - Premium',
      status: 'Active',
      holderName: 'JOHN SMITH',
      expiry: '12/2025'
    },
    {
      accountId: '12345678901',
      cardNumber: '4532123456789013',
      description: 'Inactive Card - Jane Smith - Standard',
      status: 'Inactive',
      holderName: 'JANE SMITH',
      expiry: '08/2024'
    },
    {
      accountId: '98765432109',
      cardNumber: '5555666677778888',
      description: 'Active Card - Robert Johnson - Platinum',
      status: 'Active',
      holderName: 'ROBERT JOHNSON',
      expiry: '03/2026'
    },
    {
      accountId: '11111111111',
      cardNumber: '4111111111111111',
      description: 'Expired Card - Maria Garcia - Basic',
      status: 'Expired',
      holderName: 'MARIA GARCIA',
      expiry: '06/2023'
    },
    {
      accountId: '22222222222',
      cardNumber: '4222222222222222',
      description: 'Active Premium - Alice Brown - Gold',
      status: 'Active',
      holderName: 'ALICE BROWN',
      expiry: '09/2025'
    },
    {
      accountId: '33333333333',
      cardNumber: '4333333333333333',
      description: 'High Volume Account - David Wilson',
      status: 'Active',
      holderName: 'DAVID WILSON',
      expiry: '11/2026'
    },
  ];

  const {
    updateState,
    loading,
    error,
    handleAutoSearch,
    handleSearch,
    handleFieldChange,
    handleValidateChanges,
    handleSaveChanges,
    handleCancelChanges,
    handleExit,
    isFromList,
    canSave,
    canEdit,
  } = useCreditCardUpdate({
    onError: (error: string) => console.error('❌ Credit card update error:', error),
    onSuccess: (data: any) => console.log('✅ Credit card update success:', data.cardNumber),
  });

  // Auto-búsqueda cuando viene de la lista
  useEffect(() => {
    handleAutoSearch();
  }, [handleAutoSearch]);

  const handleInputChange = useCallback((field: 'accountId' | 'cardNumber') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    let processedValue = value;
    if (field === 'accountId' && value.length > 11) {
      processedValue = value.slice(0, 11);
    } else if (field === 'cardNumber' && value.length > 16) {
      processedValue = value.slice(0, 16);
    }
    
    // Solo permitir números
    processedValue = processedValue.replace(/\D/g, '');

    setSearchForm(prev => ({ ...prev, [field]: processedValue }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(searchForm);
  }, [searchForm, handleSearch]);

  // Manejar selección de datos de prueba
  const handleTestDataSelect = useCallback((testItem: typeof testData[0]) => {
    const newSearchForm = {
      accountId: testItem.accountId,
      cardNumber: testItem.cardNumber,
    };
    
    setSearchForm(newSearchForm);
    handleSearch(newSearchForm);
    setShowTestData(false);
  }, [handleSearch]);

  // Handlers separados para TextField y Select
  const handleTextFieldUpdate = useCallback((field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    handleFieldChange(field as any, value);
  }, [handleFieldChange]);

  const handleSelectUpdate = useCallback((field: string) => (
    event: SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    handleFieldChange(field as any, value);
  }, [handleFieldChange]);

  const handleValidateAndConfirm = useCallback(() => {
    handleValidateChanges();
  }, [handleValidateChanges]);

  const handleConfirmSave = useCallback(async () => {
    setShowConfirmDialog(false);
    await handleSaveChanges();
  }, [handleSaveChanges]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit ? onExit() : handleExit();
    } else if (event.key === 'F5' && canSave) {
      event.preventDefault();
      setShowConfirmDialog(true);
    } else if (event.key === 'F12' && canEdit) {
      event.preventDefault();
      handleCancelChanges();
    }
  }, [onExit, handleExit, canSave, canEdit, handleCancelChanges]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'BLOCKED': return 'error';
      case 'EXPIRED': return 'warning';
      default: return 'default';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Expired': return 'warning';
      case 'Blocked': return 'error';
      default: return 'default';
    }
  };

  const getInfoMessage = () => {
    switch (updateState.changeAction) {
      case 'NOT_FETCHED':
        return 'Please enter Account and Card Number';
      case 'SHOW_DETAILS':
        return 'Update card details presented above.';
      case 'CHANGES_NOT_OK':
        return 'Please correct the errors and try again.';
      case 'CHANGES_OK_NOT_CONFIRMED':
        return 'Changes validated. Press F5 to save';
      case 'CHANGES_OKAYED_AND_DONE':
        return 'Changes committed to database';
      case 'CHANGES_FAILED':
        return 'Changes unsuccessful. Please try again';
      default:
        return '';
    }
  };

  // Debug log
  console.log('🎯 CreditCardUpdateScreen state:', {
    changeAction: updateState.changeAction,
    canSave,
    canEdit,
    loading,
    error
  });

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CCUP"
          programName="COCRDUPC"
          title="Update Credit Card Details"
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
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              <Edit sx={{ mr: 1, verticalAlign: 'middle' }} />
              Update Credit Card Details
            </Typography>
          </Box>

          {/* Formulario de búsqueda */}
          {updateState.changeAction === 'NOT_FETCHED' && (
            <Box sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Account Number"
                      value={searchForm.accountId}
                      onChange={handleInputChange('accountId')}
                      error={!!updateState.validationErrors.accountId}
                      helperText={updateState.validationErrors.accountId || '11 digits required'}
                      disabled={loading || isFromList}
                      fullWidth
                      inputProps={{ maxLength: 11 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="body2" color="text.secondary">#</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          ...(isFromList && { bgcolor: alpha(theme.palette.info.main, 0.1) }),
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Card Number"
                      value={searchForm.cardNumber}
                      onChange={handleInputChange('cardNumber')}
                      error={!!updateState.validationErrors.cardNumber}
                      helperText={updateState.validationErrors.cardNumber || '16 digits required'}
                      disabled={loading || isFromList}
                      fullWidth
                      inputProps={{ maxLength: 16 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          ...(isFromList && { bgcolor: alpha(theme.palette.info.main, 0.1) }),
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || isFromList}
                      startIcon={loading ? <LoadingSpinner size={20} /> : <Search />}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </Button>
                  </Grid>
                </Grid>

                {isFromList && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    Search criteria populated from card selection. Data loaded automatically.
                  </Alert>
                )}
              </Box>

              {/* Botón para mostrar datos de prueba (solo en desarrollo y cuando no viene de lista) */}
              {import.meta.env.DEV && !isFromList && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Info />}
                    onClick={() => setShowTestData(!showTestData)}
                    sx={{ borderRadius: 2 }}
                  >
                    {showTestData ? 'Hide' : 'Show'} Test Data
                  </Button>
                </Box>
              )}

              {/* Lista de datos de prueba */}
              <Collapse in={showTestData}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mt: 2, 
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    borderColor: theme.palette.info.main,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom color="info.main" fontWeight={600}>
                    Test Credit Cards (Development Only)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Click on any card to load for editing
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {testData.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <Button
                          variant="text"
                          onClick={() => handleTestDataSelect(item)}
                          sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            width: '100%',
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
                            <Grid item xs={12} sm={4}>
                              <Stack spacing={0.5}>
                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                  Account: {item.accountId}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="secondary.main" sx={{ fontFamily: 'monospace' }}>
                                  Card: {item.cardNumber}
                                </Typography>
                              </Stack>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" fontWeight={500}>
                                {item.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Holder: {item.holderName} • Exp: {item.expiry}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Chip
                                label={item.status}
                                size="small"
                                color={getTestStatusColor(item.status) as any}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Instrucciones adicionales */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Testing Tips:</strong><br />
                      • Each test card has different editable fields<br />
                      • Try changing names, status, and expiry dates<br />
                      • Use F5 to save changes, F12 to cancel<br />
                      • All test data is for development purposes only
                    </Typography>
                  </Box>
                </Paper>
              </Collapse>
            </Box>
          )}

          {/* Mensajes de Error */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Mensaje informativo */}
          {getInfoMessage() && (
            <Box sx={{ px: 3, py: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
              <Typography variant="body2" color="info.dark" fontWeight={500}>
                {getInfoMessage()}
              </Typography>
            </Box>
          )}

          {/* Detalles de la tarjeta para edición */}
          {updateState.oldDetails && updateState.newDetails && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Información no editable */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Card Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Account Number:
                          </Typography>
                          <Typography variant="h6" fontFamily="monospace" fontWeight={600}>
                            {updateState.oldDetails.accountId.toString().padStart(11, '0')}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Card Number:
                          </Typography>
                          <Typography variant="h6" fontFamily="monospace" fontWeight={600}>
                            {updateState.oldDetails.cardNumber}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Campos editables */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Editable Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack spacing={2}>
                        <TextField
                          label="Name on Card"
                          value={updateState.newDetails.embossedName}
                          onChange={handleTextFieldUpdate('embossedName')}
                          error={!!updateState.validationErrors.embossedName}
                          helperText={updateState.validationErrors.embossedName}
                          disabled={!canEdit || loading}
                          fullWidth
                          inputProps={{ maxLength: 50 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <FormControl fullWidth disabled={!canEdit || loading}>
                          <InputLabel>Card Status</InputLabel>
                          <Select
                            value={updateState.newDetails.activeStatus}
                            onChange={handleSelectUpdate('activeStatus')}
                            error={!!updateState.validationErrors.activeStatus}
                            label="Card Status"
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="A">A - Active</MenuItem>
                            <MenuItem value="I">I - Inactive</MenuItem>
                          </Select>
                          {updateState.validationErrors.activeStatus && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                              {updateState.validationErrors.activeStatus}
                            </Typography>
                          )}
                        </FormControl>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                            Expiry Date:
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <TextField
                                label="Month"
                                value={updateState.newDetails.expiryMonth}
                                onChange={handleTextFieldUpdate('expiryMonth')}
                                error={!!updateState.validationErrors.expiryMonth}
                                helperText={updateState.validationErrors.expiryMonth}
                                disabled={!canEdit || loading}
                                fullWidth
                                inputProps={{ maxLength: 2 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="Year"
                                value={updateState.newDetails.expiryYear}
                                onChange={handleTextFieldUpdate('expiryYear')}
                                error={!!updateState.validationErrors.expiryYear}
                                helperText={updateState.validationErrors.expiryYear}
                                disabled={!canEdit || loading}
                                fullWidth
                                inputProps={{ maxLength: 4 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Estado actual */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Current Status
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={updateState.oldDetails.activeStatus}
                          color={getStatusColor(updateState.oldDetails.activeStatus) as any}
                          icon={<CheckCircle />}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Current expiry: {updateState.oldDetails.expiryMonth}/{updateState.oldDetails.expiryYear}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Footer con controles */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Box>
                {updateState.changeAction === 'NOT_FETCHED' && (
                  <Typography variant="body2" color="text.secondary">
                    Enter Account and Card Number to continue
                  </Typography>
                )}
                {(updateState.changeAction === 'SHOW_DETAILS' || updateState.changeAction === 'CHANGES_NOT_OK') && (
                  <Typography variant="body2" color="text.secondary">
                    Make changes and press ENTER to validate
                  </Typography>
                )}
                {updateState.changeAction === 'CHANGES_OK_NOT_CONFIRMED' && (
                  <Button
                    variant="contained"
                    onClick={() => setShowConfirmDialog(true)}
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F5 = Save Changes
                  </Button>
                )}
              </Box>
              
              <Stack direction="row" spacing={1}>
                {/* Mostrar botón ENTER cuando se pueden hacer cambios */}
                {(updateState.changeAction === 'SHOW_DETAILS' || updateState.changeAction === 'CHANGES_NOT_OK') && (
                  <Button
                    variant="contained"
                    onClick={handleValidateAndConfirm}
                    startIcon={<KeyboardReturn />}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    ENTER = Validate
                  </Button>
                )}
                
                {canEdit && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Cancel />}
                    onClick={handleCancelChanges}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F12 = Cancel
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExitToApp />}
                  onClick={onExit || handleExit}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  F3 = Exit
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
          <DialogTitle>
            <Warning sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
            Confirm Changes
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to save the changes to this credit card?
            </Typography>
            {updateState.newDetails && updateState.oldDetails && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Changes to be saved:</Typography>
                <Stack spacing={1}>
                  {updateState.newDetails.embossedName !== updateState.oldDetails.embossedName && (
                    <Typography variant="body2">
                      Name: {updateState.oldDetails.embossedName} → {updateState.newDetails.embossedName}
                    </Typography>
                  )}
                  {updateState.newDetails.activeStatus !== (updateState.oldDetails.activeStatus === 'ACTIVE' ? 'A' : 'I') && (
                    <Typography variant="body2">
                      Status: {updateState.oldDetails.activeStatus} → {updateState.newDetails.activeStatus === 'A' ? 'ACTIVE' : 'INACTIVE'}
                    </Typography>
                  )}
                  {(updateState.newDetails.expiryMonth !== updateState.oldDetails.expiryMonth || 
                    updateState.newDetails.expiryYear !== updateState.oldDetails.expiryYear) && (
                    <Typography variant="body2">
                      Expiry: {updateState.oldDetails.expiryMonth}/{updateState.oldDetails.expiryYear} → {updateState.newDetails.expiryMonth}/{updateState.newDetails.expiryYear}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSave} 
              variant="contained" 
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}