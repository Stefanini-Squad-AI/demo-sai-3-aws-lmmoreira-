// app/components/transaction/TransactionAddScreen.tsx (corrección final)
import React, { useCallback, useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Stack,
  useTheme,
  alpha,
  Chip,
  Card,
  CardContent,
  Collapse,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon,
  ExitToApp as ExitIcon,
  AccountBalance as AccountIcon,
  CreditCard as CardIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  CalendarToday,
  Category,
  Source,
  Description,
  LocationCity,
  Business,
  LocalAtm,
  CheckCircle,
  Warning,
  AutoFixHigh,
  DataObject,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { useTransactionAdd } from '~/hooks/useTransactionAdd';
import type { TransactionAddRequest } from '~/types/transactionAdd';

interface TransactionAddScreenProps {
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function TransactionAddScreen({ onSuccess, onError }: TransactionAddScreenProps) {
  const theme = useTheme();
  const [showTestData, setShowTestData] = useState(false);
  const [showValidationHelp, setShowValidationHelp] = useState(false);
  const [showRequestPreview, setShowRequestPreview] = useState(false);
  
  const {
    formData,
    validationErrors,
    isConfirmationStep,
    loading,
    error,
    handleFieldChange,
    handleSubmit,
    handleCopyLastTransaction,
    handleClearForm,
    handleExit,
    canCopyLast,
  } = useTransactionAdd({
    onSuccess: (data) => {
      if (data.success && data.transactionId) {
        onSuccess?.(data.transactionId);
      }
    },
    onError: (error) => onError?.(error),
  });

  // ✅ CORRECCIÓN: Función helper para obtener fecha actual de forma segura
  const getCurrentDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ✅ CORRECCIÓN: Datos de prueba con fechas seguras
  const testTransactions = [
    {
      name: 'Grocery Store Purchase',
      data: {
        accountId: '11111111111',
        cardNumber: '',
        transactionTypeCode: '01',
        transactionCategoryCode: '5411',
        transactionSource: 'ONLINE',
        transactionDescription: 'GROCERY STORE PURCHASE - SUPERMARKET XYZ',
        transactionAmount: '125.50',
        originalDate: getCurrentDateString(),
        processDate: getCurrentDateString(),
        merchantId: '987654321',
        merchantName: 'SUPERMARKET XYZ',
        merchantCity: 'NEW YORK',
        merchantZip: '10001',
        confirmation: '' as const,
      } satisfies TransactionAddRequest
    },
    {
      name: 'Gas Station Purchase',
      data: {
        accountId: '22222222222',
        cardNumber: '',
        transactionTypeCode: '02',
        transactionCategoryCode: '5542',
        transactionSource: 'POS',
        transactionDescription: 'FUEL PURCHASE - SHELL STATION',
        transactionAmount: '75.25',
        originalDate: getCurrentDateString(),
        processDate: getCurrentDateString(),
        merchantId: '123456789',
        merchantName: 'SHELL GAS STATION',
        merchantCity: 'LOS ANGELES',
        merchantZip: '90210',
        confirmation: '' as const,
      } satisfies TransactionAddRequest
    },
    {
      name: 'Restaurant Purchase',
      data: {
        accountId: '33333333333',
        cardNumber: '',
        transactionTypeCode: '01',
        transactionCategoryCode: '5812',
        transactionSource: 'MOBILE',
        transactionDescription: 'RESTAURANT DINING - ITALIAN BISTRO',
        transactionAmount: '89.75',
        originalDate: getCurrentDateString(),
        processDate: getCurrentDateString(),
        merchantId: '555666777',
        merchantName: 'ITALIAN BISTRO',
        merchantCity: 'CHICAGO',
        merchantZip: '60601',
        confirmation: '' as const,
      } satisfies TransactionAddRequest
    },
    {
      name: 'ATM Withdrawal',
      data: {
        accountId: '44444444444',
        cardNumber: '',
        transactionTypeCode: '03',
        transactionCategoryCode: '6011',
        transactionSource: 'ATM',
        transactionDescription: 'CASH WITHDRAWAL - ATM TRANSACTION',
        transactionAmount: '-200.00',
        originalDate: getCurrentDateString(),
        processDate: getCurrentDateString(),
        merchantId: '999888777',
        merchantName: 'BANK ATM',
        merchantCity: 'MIAMI',
        merchantZip: '33101',
        confirmation: '' as const,
      } satisfies TransactionAddRequest
    },
    {
      name: 'Online Purchase',
      data: {
        accountId: '',
        cardNumber: '4111111111111111',
        transactionTypeCode: '01',
        transactionCategoryCode: '5999',
        transactionSource: 'ECOMMERCE',
        transactionDescription: 'ONLINE PURCHASE - AMAZON.COM',
        transactionAmount: '299.99',
        originalDate: getCurrentDateString(),
        processDate: getCurrentDateString(),
        merchantId: '111222333',
        merchantName: 'AMAZON.COM',
        merchantCity: 'SEATTLE',
        merchantZip: '98101',
        confirmation: '' as const,
      } satisfies TransactionAddRequest
    },
  ];

  // Categorías comunes para ayuda
  const commonCategories = [
    { code: '5411', name: 'Grocery Stores' },
    { code: '5542', name: 'Automated Fuel Dispensers' },
    { code: '5812', name: 'Eating Places, Restaurants' },
    { code: '5999', name: 'Miscellaneous Retail' },
    { code: '6011', name: 'ATM/Cash Advance' },
    { code: '7011', name: 'Hotels, Motels' },
    { code: '5311', name: 'Department Stores' },
    { code: '4111', name: 'Transportation' },
  ];

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3') {
      event.preventDefault();
      handleExit();
    } else if (event.key === 'F4') {
      event.preventDefault();
      handleClearForm();
    } else if (event.key === 'F5') {
      event.preventDefault();
      handleCopyLastTransaction();
    }
  }, [handleExit, handleClearForm, handleCopyLastTransaction]);

  const handleTestDataSelect = useCallback((testData: TransactionAddRequest) => {
    Object.entries(testData).forEach(([field, value]) => {
      handleFieldChange(field as keyof TransactionAddRequest, value);
    });
    setShowTestData(false);
  }, [handleFieldChange]);

  const handleQuickFill = useCallback((field: keyof TransactionAddRequest, value: string) => {
    handleFieldChange(field, value);
  }, [handleFieldChange]);

  const renderFormField = (
    field: keyof TransactionAddRequest,
    label: string,
    props: any = {}
  ) => (
    <TextField
      label={label}
      value={formData[field]}
      onChange={(e) => handleFieldChange(field, e.target.value)}
      error={!!validationErrors[field]}
      helperText={validationErrors[field]}
      disabled={loading}
      fullWidth
      variant="outlined"
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      {...props}
    />
  );

  // ✅ CORRECCIÓN: Función getRequestPreview con manejo seguro de fechas
  const getRequestPreview = () => {
    return {
      // Campos que se enviarán al backend
      ...(formData.accountId && { accountId: formData.accountId }),
      ...(formData.cardNumber && { cardNumber: formData.cardNumber }),
      transactionTypeCode: formData.transactionTypeCode,
      transactionCategoryCode: formData.transactionCategoryCode,
      transactionSource: formData.transactionSource,
      transactionDescription: formData.transactionDescription,
      transactionAmount: formData.transactionAmount ? parseFloat(formData.transactionAmount) : 0,
      // ✅ CORRECCIÓN: Manejo seguro de fechas con fallback
      originalDate: formData.originalDate ? new Date(formData.originalDate + 'T00:00:00.000Z').toISOString() : new Date().toISOString(),
      processDate: formData.processDate ? new Date(formData.processDate + 'T00:00:00.000Z').toISOString() : new Date().toISOString(),
      merchantId: formData.merchantId,
      merchantName: formData.merchantName,
      merchantCity: formData.merchantCity,
      merchantZip: formData.merchantZip,
      confirmation: formData.confirmation,
    };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CT02"
          programName="COTRN02C"
          title="Add Transaction"
          subtitle="CardDemo - Transaction Management"
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
            <MoneyIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              Add Transaction
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Enter transaction details and confirm to add to the system
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {/* Herramientas de desarrollo */}
            {import.meta.env.DEV && (
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() => setShowTestData(!showTestData)}
                    sx={{ borderRadius: 2 }}
                  >
                    {showTestData ? 'Hide' : 'Show'} Test Data
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AutoFixHigh />}
                    onClick={() => setShowValidationHelp(!showValidationHelp)}
                    sx={{ borderRadius: 2 }}
                  >
                    {showValidationHelp ? 'Hide' : 'Show'} Validation Help
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DataObject />}
                    onClick={() => setShowRequestPreview(!showRequestPreview)}
                    sx={{ borderRadius: 2 }}
                  >
                    {showRequestPreview ? 'Hide' : 'Show'} Request Preview
                  </Button>
                </Stack>

                {/* Test Data Panel */}
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
                      Test Transactions (Development Only)
                    </Typography>
                    <Grid container spacing={2}>
                      {testTransactions.map((test, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4],
                              }
                            }}
                            onClick={() => handleTestDataSelect(test.data)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                {test.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Account: {test.data.accountId || test.data.cardNumber}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Amount: {test.data.transactionAmount}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Category: {test.data.transactionCategoryCode}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Collapse>

                {/* Validation Help Panel */}
                <Collapse in={showValidationHelp}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mt: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      borderColor: theme.palette.warning.main,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom color="warning.main" fontWeight={600}>
                      Validation Rules & Quick Fill
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Field Requirements:
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="caption">• Account ID: 11 digits OR Card Number: 16 digits</Typography>
                          <Typography variant="caption">• Type CD: 1-2 digits (01, 02, 03)</Typography>
                          <Typography variant="caption">• Category CD: 1-4 digits (5411, 5542, etc.)</Typography>
                          <Typography variant="caption">• Amount: Format -99999999.99</Typography>
                          <Typography variant="caption">• Dates: YYYY-MM-DD format</Typography>
                          <Typography variant="caption">• Merchant ID: Numeric only</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Common Categories:
                        </Typography>
                        <Stack spacing={0.5}>
                          {commonCategories.slice(0, 6).map((cat) => (
                            <Button
                              key={cat.code}
                              variant="text"
                              size="small"
                              onClick={() => handleQuickFill('transactionCategoryCode', cat.code)}
                              sx={{ 
                                justifyContent: 'flex-start', 
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                py: 0.5,
                              }}
                            >
                              {cat.code} - {cat.name}
                            </Button>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>

                {/* Request Preview Panel */}
                <Collapse in={showRequestPreview}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mt: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      borderColor: theme.palette.success.main,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom color="success.main" fontWeight={600}>
                      Backend Request Preview
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        bgcolor: theme.palette.grey[100],
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        maxHeight: 200,
                      }}
                    >
                      {JSON.stringify(getRequestPreview(), null, 2)}
                    </Box>
                  </Paper>
                </Collapse>
              </Box>
            )}

            {/* Identificación */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountIcon />
                Account Identification
                <Tooltip title="Enter either Account # (11 digits) or Card # (16 digits)">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderFormField('accountId', 'Enter Acct #', {
                    placeholder: '11111111111',
                    inputProps: { maxLength: 11 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountIcon color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['11111111111', '22222222222', '33333333333'].map((acc) => (
                        <Chip
                          key={acc}
                          label={acc}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('accountId', acc)}
                          sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderFormField('cardNumber', 'Card #', {
                    placeholder: '4111111111111111',
                    inputProps: { maxLength: 16 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CardIcon color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['4111111111111111', '4222222222222222'].map((card) => (
                        <Chip
                          key={card}
                          label={`****${card.slice(-4)}`}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('cardNumber', card)}
                          sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Enter either Account # (11 digits) or Card # (16 digits) - both are not required
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Datos de Transacción */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Transaction Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  {renderFormField('transactionTypeCode', 'Type CD', {
                    placeholder: '01',
                    inputProps: { maxLength: 2 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Category color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['01', '02', '03'].map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('transactionTypeCode', type)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  {renderFormField('transactionCategoryCode', 'Category CD', {
                    placeholder: '5411',
                    inputProps: { maxLength: 4 },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['5411', '5542', '5812'].map((cat) => (
                        <Chip
                          key={cat}
                          label={cat}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('transactionCategoryCode', cat)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  {renderFormField('transactionSource', 'Source', {
                    placeholder: 'ONLINE',
                    inputProps: { maxLength: 10 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Source color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['ONLINE', 'POS', 'ATM', 'MOBILE'].map((source) => (
                        <Chip
                          key={source}
                          label={source}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('transactionSource', source)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderFormField('transactionDescription', 'Description', {
                    placeholder: 'Transaction description',
                    inputProps: { maxLength: 60 },
                    multiline: true,
                    rows: 2,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <Description color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                </Grid>
                <Grid item xs={12} md={4}>
                  {renderFormField('transactionAmount', 'Amount', {
                    placeholder: '-99999999.99',
                    inputProps: { maxLength: 12 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  <Typography variant="caption" color="text.secondary">
                    Format: -99999999.99 (negative for debits)
                  </Typography>
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['100.00', '-50.00', '25.99'].map((amount) => (
                        <Chip
                          key={amount}
                          label={amount}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('transactionAmount', amount)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  {renderFormField('originalDate', 'Orig Date', {
                    type: 'date',
                    InputLabelProps: { shrink: true },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  <Typography variant="caption" color="text.secondary">
                    YYYY-MM-DD
                  </Typography>
                  {import.meta.env.DEV && (
                    <Button
                      size="small"
                      variant="text"
                      // ✅ CORRECCIÓN: Usar función helper segura
                      onClick={() => handleQuickFill('originalDate', getCurrentDateString())}
                      sx={{ mt: 0.5, fontSize: '0.7rem' }}
                    >
                      Today
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  {renderFormField('processDate', 'Proc Date', {
                    type: 'date',
                    InputLabelProps: { shrink: true },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  <Typography variant="caption" color="text.secondary">
                    YYYY-MM-DD
                  </Typography>
                  {import.meta.env.DEV && (
                    <Button
                      size="small"
                      variant="text"
                      // ✅ CORRECCIÓN: Usar función helper segura
                      onClick={() => handleQuickFill('processDate', getCurrentDateString())}
                      sx={{ mt: 0.5, fontSize: '0.7rem' }}
                    >
                      Today
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Datos del Comerciante */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StoreIcon />
                Merchant Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderFormField('merchantId', 'Merchant ID', {
                    placeholder: '987654321',
                    inputProps: { maxLength: 9 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['987654321', '123456789', '555666777'].map((id) => (
                        <Chip
                          key={id}
                          label={id}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('merchantId', id)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderFormField('merchantName', 'Merchant Name', {
                    placeholder: 'MERCHANT NAME',
                    inputProps: { maxLength: 30 },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['SUPERMARKET XYZ', 'GAS STATION', 'RESTAURANT'].map((name) => (
                        <Chip
                          key={name}
                          label={name}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('merchantName', name)}
                          sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderFormField('merchantCity', 'Merchant City', {
                    placeholder: 'CITY NAME',
                    inputProps: { maxLength: 25 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['NEW YORK', 'LOS ANGELES', 'CHICAGO'].map((city) => (
                        <Chip
                          key={city}
                          label={city}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('merchantCity', city)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderFormField('merchantZip', 'Merchant Zip', {
                    placeholder: '12345',
                    inputProps: { maxLength: 10 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalAtm color="primary" />
                        </InputAdornment>
                      ),
                    },
                  })}
                  {import.meta.env.DEV && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {['10001', '90210', '60601'].map((zip) => (
                        <Chip
                          key={zip}
                          label={zip}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickFill('merchantZip', zip)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </Box>

            {/* Confirmación */}
            {isConfirmationStep && (
              <Box sx={{ mb: 4 }}>
                <Alert 
                  severity="warning" 
                  sx={{ mb: 2 }}
                  icon={<Warning />}
                >
                  You are about to add this transaction. Please confirm:
                </Alert>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Typography variant="body1" color="primary.main" fontWeight={600}>
                      Confirm:
                    </Typography>
                  </Grid>
                  <Grid item>
                    {renderFormField('confirmation', '', {
                      placeholder: 'Y/N',
                      inputProps: { 
                        maxLength: 1, 
                        style: { textAlign: 'center', textTransform: 'uppercase' } 
                      },
                      sx: { width: 80 },
                    })}
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      (Y/N)
                    </Typography>
                  </Grid>
                  {import.meta.env.DEV && (
                    <Grid item>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label="Y"
                          size="small"
                          color="success"
                          variant="outlined"
                          onClick={() => handleQuickFill('confirmation', 'Y')}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Chip
                          label="N"
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleQuickFill('confirmation', 'N')}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Errores */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Botones de Acción */}
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <MoneyIcon /> : isConfirmationStep ? <CheckCircle /> : <SaveIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {loading ? 'Processing...' : isConfirmationStep ? 'Confirm & Add' : 'Continue'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleClearForm}
                disabled={loading}
                startIcon={<ClearIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F4 = Clear
              </Button>
              
              {canCopyLast && (
                <Button
                  variant="outlined"
                  onClick={handleCopyLastTransaction}
                  disabled={loading}
                  startIcon={<CopyIcon />}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  F5 = Copy Last
                </Button>
              )}
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleExit}
                disabled={loading}
                startIcon={<ExitIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F3 = Exit
              </Button>
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ENTER = Continue • F3 = Back • F4 = Clear • F5 = Copy Last Tran.
            </Typography>
            {import.meta.env.DEV && (
              <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 0.5 }}>
                Development Mode: Test data and validation helpers available
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}