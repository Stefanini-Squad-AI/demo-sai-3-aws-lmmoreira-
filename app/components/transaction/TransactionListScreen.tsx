// app/components/transaction/TransactionListScreen.tsx
import React, { useEffect, useCallback, useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Stack,
  Chip,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  ExitToApp as ExitIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as DateIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { useTransactionList } from '~/hooks/useTransactionList';

interface TransactionListScreenProps {
  onTransactionSelect?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function TransactionListScreen({ 
  onTransactionSelect, 
  onError 
}: TransactionListScreenProps) {
  const theme = useTheme();
  const [selectionInputs, setSelectionInputs] = useState<Record<string, string>>({});

  // ✅ CORRECCIÓN: Filtrar callbacks undefined
  const {
    searchTransactionId,
    currentPage,
    transactions,
    hasNextPage,
    hasPreviousPage,
    validationErrors,
    loading,
    error,
    handleSearch,
    handleTransactionSelect,
    handleNextPage,
    handlePreviousPage,
    handleSearchChange,
    handleExit,
    handleInitialLoad,
  } = useTransactionList({
    ...(onTransactionSelect && { onTransactionSelect }),
    ...(onError && { onError }),
  });

  // Cargar datos iniciales
  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  // Manejar teclas de función
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3') {
      event.preventDefault();
      handleExit();
    } else if (event.key === 'F7') {
      event.preventDefault();
      handlePreviousPage();
    } else if (event.key === 'F8') {
      event.preventDefault();
      handleNextPage();
    }
  }, [handleExit, handlePreviousPage, handleNextPage]);

  // Manejar cambio en campos de selección
  const handleSelectionChange = useCallback((transactionId: string, value: string) => {
    setSelectionInputs(prev => ({ ...prev, [transactionId]: value.toUpperCase() }));
  }, []);

  // Manejar envío de selección
  const handleSelectionSubmit = useCallback((transactionId: string) => {
    const selection = selectionInputs[transactionId];
    if (selection) {
      handleTransactionSelect(transactionId, selection);
    }
  }, [selectionInputs, handleTransactionSelect]);

  // Formatear monto como en COBOL
  const formatAmount = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CT00"
          programName="COTRN00C"
          title="List Transactions"
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
            <ReceiptIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              List Transactions
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
              <Chip
                label={`Page: ${currentPage}`}
                variant="filled"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>

          <Box sx={{ p: 4 }}>
            {/* Búsqueda */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon />
                Search Transaction
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <TextField
                  label="Search Tran ID"
                  value={searchTransactionId}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  error={!!validationErrors.searchTransactionId}
                  helperText={validationErrors.searchTransactionId || 'Enter numeric Transaction ID'}
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
                    maxWidth: 300,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
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

            {/* Tabla de Transacciones */}
            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                mb: 3,
                maxHeight: 600,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      Sel
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReceiptIcon fontSize="small" />
                        Transaction ID
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateIcon fontSize="small" />
                        Date
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'primary.contrastText', textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                        <MoneyIcon fontSize="small" />
                        Amount
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {loading ? 'Loading transactions...' : 'No transactions found'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => ( // ✅ CORRECCIÓN: Remover index no usado
                      <TableRow 
                        key={transaction.transactionId}
                        sx={{ 
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                          '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.grey[100], 0.5) },
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                              size="small"
                              value={selectionInputs[transaction.transactionId] || ''}
                              onChange={(e) => handleSelectionChange(transaction.transactionId, e.target.value)}
                              error={!!validationErrors[`selection_${transaction.transactionId}`]}
                              placeholder="S"
                              inputProps={{ 
                                maxLength: 1,
                                style: { 
                                  textAlign: 'center', 
                                  textTransform: 'uppercase',
                                  width: '30px',
                                }
                              }}
                              sx={{ width: 60 }}
                            />
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleSelectionSubmit(transaction.transactionId)}
                                disabled={!selectionInputs[transaction.transactionId]}
                                color="primary"
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {validationErrors[`selection_${transaction.transactionId}`] && (
                            <Typography variant="caption" color="error" display="block">
                              {validationErrors[`selection_${transaction.transactionId}`]}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                            {transaction.transactionId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {transaction.date}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 300 }}>
                            {transaction.description}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="body2" 
                            fontFamily="monospace" 
                            fontWeight={600}
                            color={transaction.amount < 0 ? 'error.main' : 'success.main'}
                          >
                            {formatAmount(transaction.amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Instrucciones */}
            <Alert 
              severity="info" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<InfoIcon />}
            >
              Type 'S' to View Transaction details from the list
            </Alert>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Navegación */}
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={handlePreviousPage}
                disabled={loading || !hasPreviousPage}
                startIcon={<PrevIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F7 = Backward
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={loading || !hasNextPage}
                startIcon={<NextIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                F8 = Forward
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
              ENTER = Continue • F3 = Back • F7 = Backward • F8 = Forward
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}