// app/components/creditCard/CreditCardListScreen.tsx (versión con cuentas de prueba)
import React, { useState, useCallback, useEffect } from 'react';
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
  Chip,
  Stack,
  Grid,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Collapse,
} from '@mui/material';
import {
  Search,
  NavigateBefore,
  NavigateNext,
  Visibility,
  Edit,
  ExitToApp,
  CreditCard,
  Clear,
  Info,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useCreditCardList } from '~/hooks/useCreditCardList';
import type { CreditCardFilter } from '~/types/creditCard';

interface CreditCardListScreenProps {
  onExit?: () => void;
}

export function CreditCardListScreen({ onExit }: CreditCardListScreenProps) {
  const theme = useTheme();
  const [searchForm, setSearchForm] = useState<CreditCardFilter>({
    accountId: '',
    cardNumber: '',
  });
  const [showTestData, setShowTestData] = useState(false);

  // Datos de prueba para desarrollo
  const testData = [
    {
      accountId: '12345678901',
      cardNumber: '4532123456789012',
      description: 'Active Account - Multiple Cards',
      expectedResults: 2,
      status: 'Active'
    },
    {
      accountId: '98765432109',
      cardNumber: '5555666677778888',
      description: 'Mixed Status Account',
      expectedResults: 2,
      status: 'Mixed'
    },
    {
      accountId: '11111111111',
      cardNumber: '4111111111111111',
      description: 'Single Expired Card',
      expectedResults: 1,
      status: 'Expired'
    },
    {
      accountId: '22222222222',
      cardNumber: '4222222222222222',
      description: 'Active Premium Account',
      expectedResults: 1,
      status: 'Active'
    },
    {
      accountId: '33333333333',
      cardNumber: '4333333333333333',
      description: 'High Volume Account',
      expectedResults: 1,
      status: 'Active'
    },
    {
      accountId: '44444444444',
      cardNumber: '4444444444444444',
      description: 'Inactive Account',
      expectedResults: 1,
      status: 'Inactive'
    },
  ];

  const {
    data,
    loading,
    error,
    currentPage,
    selectedCards,
    validationErrors,
    handleSearch,
    handlePageChange,
    handleCardSelection,
    handleProcessSelection,
    handleExit,
    canGoNext,
    canGoPrev,
    totalPages,
    totalElements,
  } = useCreditCardList({
    onError: (error) => console.error('Credit card list error:', error),
    onSuccess: (data) => console.log('Credit cards loaded:', data.numberOfElements),
  });

  const handleInputChange = useCallback((field: keyof CreditCardFilter) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    // Aplicar restricciones de longitud como en el COBOL
    let processedValue = value;
    // if (field === 'accountId' && value.length > 11) {
    //   processedValue = value.slice(0, 11);
    /* } else  */if (field === 'cardNumber' && value.length > 16) {
      processedValue = value.slice(0, 16);
    }
    
    // Solo permitir números
    if (field === 'accountId' || field === 'cardNumber') {
      processedValue = processedValue.replace(/\D/g, '');
    }

    setSearchForm(prev => ({ ...prev, [field]: processedValue }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(searchForm);
  }, [searchForm, handleSearch]);

  const handleClearFilters = useCallback(() => {
    setSearchForm({ accountId: '', cardNumber: '' });
  }, []);

  const handleTestDataSelect = useCallback((testItem: typeof testData[0], searchType: 'account' | 'card') => {
    const newSearchForm = {
      accountId: searchType === 'account' ? testItem.accountId : '',
      cardNumber: searchType === 'card' ? testItem.cardNumber : '',
    };
    
    setSearchForm(newSearchForm);
    handleSearch(newSearchForm);
    setShowTestData(false);
  }, [handleSearch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit ? onExit() : handleExit();
    } else if (event.key === 'F7') {
      event.preventDefault();
      if (canGoPrev) {
        handlePageChange(currentPage - 1);
      }
    } else if (event.key === 'F8') {
      event.preventDefault();
      if (canGoNext) {
        handlePageChange(currentPage + 1);
      }
    } else if (event.key === 'Enter' && Object.keys(selectedCards).length > 0) {
      event.preventDefault();
      handleProcessSelection();
    }
  }, [onExit, handleExit, canGoPrev, canGoNext, currentPage, handlePageChange, selectedCards, handleProcessSelection]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'BLOCKED': return 'error';
      case 'EXPIRED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'A';
      case 'INACTIVE': return 'I';
      case 'BLOCKED': return 'B';
      case 'EXPIRED': return 'E';
      default: return status.charAt(0);
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Mixed': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CCLI"
          programName="COCRDLIC"
          title="List Credit Cards"
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
            <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard />
              List Credit Cards
              {totalPages > 0 && (
                <Chip
                  label={`Page ${currentPage}`}
                  size="small"
                  sx={{ 
                    ml: 'auto',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Filtros de Búsqueda */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Account Number"
                    value={searchForm.accountId || ''}
                    onChange={handleInputChange('accountId')}
                    error={!!validationErrors.accountId}
                    helperText={validationErrors.accountId || '11 digits'}
                    disabled={loading}
                    fullWidth
                    inputProps={{
                      maxLength: 11,
                      pattern: '[0-9]*',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.secondary">
                            #
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Credit Card Number"
                    value={searchForm.cardNumber || ''}
                    onChange={handleInputChange('cardNumber')}
                    error={!!validationErrors.cardNumber}
                    helperText={validationErrors.cardNumber || '16 digits'}
                    disabled={loading}
                    fullWidth
                    inputProps={{
                      maxLength: 16,
                      pattern: '[0-9]*',
                    }}
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
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <LoadingSpinner size={20} /> : <Search />}
                      sx={{ borderRadius: 2, minWidth: 120 }}
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      disabled={loading}
                      startIcon={<Clear />}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Botón para mostrar datos de prueba (solo en desarrollo) */}
            {import.meta.env.DEV && (
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
                  Test Data (Development Only)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Click on Account ID or Card Number to search
                </Typography>
                
                <Grid container spacing={1}>
                  {testData.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleTestDataSelect(item, 'account')}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textTransform: 'none',
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  color: 'primary.main',
                                }}
                              >
                                Account: {item.accountId}
                              </Button>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleTestDataSelect(item, 'card')}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textTransform: 'none',
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  color: 'secondary.main',
                                }}
                              >
                                Card: {item.cardNumber}
                              </Button>
                            </Stack>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" fontWeight={500}>
                              {item.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Expected results: {item.expectedResults} card(s)
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Chip
                              label={item.status}
                              size="small"
                              color={getTestStatusColor(item.status) as any}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Instrucciones adicionales */}
                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Testing Tips:</strong><br />
                    • Search by Account ID to see all cards for that account<br />
                    • Search by Card Number to find a specific card<br />
                    • Leave both fields empty to see all cards (admin users only)<br />
                    • Use F7/F8 for pagination when results span multiple pages<br />
                    • Click S (View) or U (Update) buttons to select a card, then press ENTER
                  </Typography>
                </Box>
              </Paper>
            </Collapse>
          </Box>

          {/* Mensajes de Error */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Información de resultados */}
          {data && data.content.length > 0 && (
            <Box sx={{ px: 3, py: 1, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
              <Typography variant="body2" color="success.dark" fontWeight={500}>
                Found {totalElements} card(s) • Showing page {currentPage} of {totalPages}
              </Typography>
            </Box>
          )}

          {/* Tabla de Resultados */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                  <TableCell width="10%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Select
                    </Typography>
                  </TableCell>
                  <TableCell width="35%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Account Number
                    </Typography>
                  </TableCell>
                  <TableCell width="40%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Card Number
                    </Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Active
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.content.map((card, index) => (
                  <TableRow
                    key={`${card.accountNumber}-${card.cardNumber}`}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleCardSelection(index, selectedCards[index] === 'S' ? '' : 'S')}
                          color={selectedCards[index] === 'S' ? 'primary' : 'default'}
                          sx={{
                            border: selectedCards[index] === 'S' ? 2 : 1,
                            borderColor: selectedCards[index] === 'S' ? 'primary.main' : 'divider',
                          }}
                          title="View Details (S)"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleCardSelection(index, selectedCards[index] === 'U' ? '' : 'U')}
                          color={selectedCards[index] === 'U' ? 'secondary' : 'default'}
                          sx={{
                            border: selectedCards[index] === 'U' ? 2 : 1,
                            borderColor: selectedCards[index] === 'U' ? 'secondary.main' : 'divider',
                          }}
                          title="Update Card (U)"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {card.accountNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {card.cardNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(card.cardStatus)}
                        size="small"
                        color={getStatusColor(card.cardStatus) as any}
                        sx={{ minWidth: 32, fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Filas vacías para mantener 7 filas como en el COBOL */}
                {data && data.content.length < 7 && 
                  Array.from({ length: 7 - data.content.length }).map((_, index) => (
                    <TableRow key={`empty-${index}`} sx={{ height: 57 }}>
                      <TableCell colSpan={4}>&nbsp;</TableCell>
                    </TableRow>
                  ))
                }
                
                {/* Mensaje cuando no hay datos */}
                {!loading && (!data || data.content.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        {searchForm.accountId || searchForm.cardNumber 
                          ? 'No records found for this search condition'
                          : 'Enter search criteria and click Search to find credit cards'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Información y Controles */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                {Object.keys(selectedCards).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    TYPE S FOR DETAIL, U TO UPDATE ANY RECORD
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleProcessSelection}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    ENTER = Continue
                  </Button>
                )}
              </Grid>

              <Grid item>
                <Stack direction="row" spacing={1} alignItems="center">
                  {totalElements > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {totalElements} records found
                    </Typography>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<NavigateBefore />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!canGoPrev || loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F7 = Backward
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<NavigateNext />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!canGoNext || loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F8 = Forward
                  </Button>
                  
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
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}