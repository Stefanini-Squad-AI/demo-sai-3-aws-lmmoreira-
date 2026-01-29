// app/components/transaction/TransactionViewScreen.tsx
import React, { useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Stack,
  Divider,
  useTheme,
  alpha,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExitToApp as ExitIcon,
  List as ListIcon,
  Receipt as ReceiptIcon,
  CreditCard as CardIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as DateIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  LocationCity as CityIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { useTransactionView } from '~/hooks/useTransactionView';

interface TransactionViewScreenProps {
  initialTransactionId?: string;
  onError?: (error: string) => void;
}

export function TransactionViewScreen({ 
  initialTransactionId, 
  onError 
}: TransactionViewScreenProps) {
  const theme = useTheme();

  const {
    searchTransactionId,
    transactionData,
    validationErrors,
    loading,
    error,
    handleSearch,
    handleSearchChange,
    handleClearScreen,
    handleBrowseTransactions,
    handleExit,
    handleInitialLoad,
  } = useTransactionView({
    ...(initialTransactionId && { initialTransactionId }),
    ...(onError && { onError }),
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (initialTransactionId) {
      handleInitialLoad();
    }
  }, [handleInitialLoad, initialTransactionId]);

  // Manejar teclas de función
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3') {
      event.preventDefault();
      handleExit();
    } else if (event.key === 'F4') {
      event.preventDefault();
      handleClearScreen();
    } else if (event.key === 'F5') {
      event.preventDefault();
      handleBrowseTransactions();
    } else if (event.key === 'Enter' && event.target === event.currentTarget) {
      event.preventDefault();
      handleSearch();
    }
  }, [handleExit, handleClearScreen, handleBrowseTransactions, handleSearch]);

  // Formatear monto
  const formatAmount = useCallback((amount?: string): string => {
    if (!amount) return '';
    try {
      const numericAmount = parseFloat(amount);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(numericAmount);
    } catch {
      return amount; // Fallback si no se puede parsear
    }
  }, []);

  // Formatear fecha
  const formatDateTime = useCallback((dateTime?: string): string => {
    if (!dateTime) return '';
    try {
      return new Date(dateTime).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateTime;
    }
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CT01"
          programName="COTRN01C"
          title="View Transaction"
          subtitle="CardDemo - Transaction View"
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
            <ReceiptIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              View Transaction
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Enter Transaction ID to view details
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {/* Búsqueda */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon />
                Enter Transaction ID
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <TextField
                  label="Enter Tran ID"
                  value={searchTransactionId}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  error={!!validationErrors.searchTransactionId}
                  helperText={validationErrors.searchTransactionId || 'Enter Transaction ID to search'}
                  disabled={loading}
                  placeholder="Enter Transaction ID"
                  inputProps={{ 
                    maxLength: 16,
                    style: { fontFamily: 'monospace' }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    maxWidth: 400,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  startIcon={<SearchIcon />}
                  sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                >
                  Search
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Detalles de Transacción */}
            {transactionData && !validationErrors.searchTransactionId && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon />
                  Transaction Details
                </Typography>

                <Grid container spacing={3}>
                  {/* Información Básica */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main">
                          Basic Information
                        </Typography>
                        
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                            <Typography variant="body1" fontFamily="monospace" fontWeight={600}>
                              {transactionData.transactionId || 'N/A'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Card Number</Typography>
                            <Typography variant="body1" fontFamily="monospace" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CardIcon fontSize="small" color="primary" />
                              {transactionData.cardNumber || 'N/A'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Type Code</Typography>
                            <Typography variant="body1" fontFamily="monospace">
                              {transactionData.transactionTypeCode || 'N/A'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Category Code</Typography>
                            <Typography variant="body1" fontFamily="monospace" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CategoryIcon fontSize="small" color="primary" />
                              {transactionData.transactionCategoryCode || 'N/A'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Source</Typography>
                            <Typography variant="body1">
                              {transactionData.transactionSource || 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Información Financiera */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main">
                          Financial Information
                        </Typography>
                        
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Amount</Typography>
                            <Typography 
                              variant="h6" 
                              fontFamily="monospace" 
                              fontWeight={600}
                              color={transactionData.transactionAmount && parseFloat(transactionData.transactionAmount) < 0 ? 'error.main' : 'success.main'}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <MoneyIcon fontSize="small" />
                              {formatAmount(transactionData.transactionAmount)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Original Date</Typography>
                            <Typography variant="body1" fontFamily="monospace" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DateIcon fontSize="small" color="primary" />
                              {formatDateTime(transactionData.originalTimestamp)}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">Processed Date</Typography>
                            <Typography variant="body1" fontFamily="monospace" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DateIcon fontSize="small" color="primary" />
                              {formatDateTime(transactionData.processedTimestamp)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Descripción */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main">
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {transactionData.transactionDescription || 'No description available'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Información del Comerciante */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StoreIcon />
                          Merchant Information
                        </Typography>
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Merchant ID</Typography>
                            <Typography variant="body1" fontFamily="monospace" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon fontSize="small" color="primary" />
                              {transactionData.merchantId || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Merchant Name</Typography>
                            <Typography variant="body1">
                              {transactionData.merchantName || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">City</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CityIcon fontSize="small" color="primary" />
                              {transactionData.merchantCity || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Zip Code</Typography>
                            <Typography variant="body1" fontFamily="monospace">
                              {transactionData.merchantZip || 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Botones de Acción */}
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={handleClearScreen}
                disabled={loading}
                startIcon={<ClearIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F4 = Clear
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleBrowseTransactions}
                disabled={loading}
                startIcon={<ListIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F5 = Browse Tran.
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleExit}
                disabled={loading}
                startIcon={<ExitIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F3 = Back
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
              ENTER = Fetch • F3 = Back • F4 = Clear • F5 = Browse Tran.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}