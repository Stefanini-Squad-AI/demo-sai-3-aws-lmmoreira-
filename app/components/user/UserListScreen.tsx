// app/components/user/UserListScreen.tsx (versión con Select)
import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Alert,
  Stack,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  KeyboardReturn,
  NavigateBefore,
  NavigateNext,
  ExitToApp,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import type { UserSecurityData, UserListRequest, UserSelectionAction, NormalizedUserType } from '~/types/user';
import { normalizeUserType } from '~/types/user';

interface UserListScreenProps {
  users: UserSecurityData[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchCriteria?: string;
  onSearch: (criteria: UserListRequest) => void;
  onUserAction: (action: UserSelectionAction) => void;
  onPageChange: (page: number) => void;
  onExit: () => void;
}

export function UserListScreen({
  users,
  loading,
  error,
  pagination,
  searchCriteria,
  onSearch,
  onUserAction,
  onPageChange,
  onExit,
}: UserListScreenProps) {
  const theme = useTheme();
  const [searchInput, setSearchInput] = useState(searchCriteria || '');
  
  // ✅ Estado para selecciones como en el mainframe original (pero con Select)
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});

  // ✅ Manejar búsqueda (equivalente a PROCESS-ENTER-KEY cuando no hay selección)
  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const searchUserId = searchInput.trim() || undefined;
    onSearch({
      searchUserId,
      page: 1,
      limit: 10,
    });
  }, [searchInput, onSearch]);

  // ✅ Manejar selección con Select (más user-friendly que input de texto)
  const handleSelectionChange = useCallback((userId: string, value: string) => {
    setUserSelections(prev => ({
      ...prev,
      [userId]: value,
    }));
  }, []);

  // ✅ Procesar ENTER (equivalente a PROCESS-ENTER-KEY del COBOL)
  const handleEnterKey = useCallback(() => {
    // Buscar la primera selección válida (como en el mainframe)
    const selectedEntries = Object.entries(userSelections).filter(([_, action]) => action !== '');
    
    if (selectedEntries.length === 0) {
      // Si no hay selección, hacer búsqueda
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
      return;
    }

    // Procesar la primera selección (como en el mainframe original)
    const firstSelection = selectedEntries[0];
    if (firstSelection) {
      const [userId, action] = firstSelection;
      if (action === 'U' || action === 'D') {
        onUserAction({ userId, action });
        
        // Limpiar selecciones después de procesar
        setUserSelections({});
      }
    }
  }, [userSelections, handleSearch, onUserAction]);

  // ✅ Manejar teclas de función exactamente como en COBOL
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        handleEnterKey();
        break;
      case 'F3':
      case 'Escape':
        event.preventDefault();
        onExit();
        break;
      case 'F7':
        event.preventDefault();
        if (pagination.hasPrev) {
          onPageChange(pagination.page - 1);
        }
        break;
      case 'F8':
        event.preventDefault();
        if (pagination.hasNext) {
          onPageChange(pagination.page + 1);
        }
        break;
    }
  }, [handleEnterKey, onExit, onPageChange, pagination]);

  // ✅ Limpiar input cuando cambia el criterio de búsqueda externo
  useEffect(() => {
    setSearchInput(searchCriteria || '');
  }, [searchCriteria]);

  // ✅ Funciones auxiliares con tipos normalizados
  const getUserTypeLabel = (userType: 'A' | 'U' | 'R') => {
    const normalized = normalizeUserType(userType);
    return normalized === 'A' ? 'Admin' : 'User';
  };

  const getUserTypeColor = (userType: 'A' | 'U' | 'R'): 'error' | 'primary' => {
    const normalized = normalizeUserType(userType);
    return normalized === 'A' ? 'error' : 'primary';
  };

  const getUserTypeIcon = (userType: 'A' | 'U' | 'R') => {
    const normalized = normalizeUserType(userType);
    return normalized === 'A' ? <AdminPanelSettings /> : <Person />;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CU00"
          programName="COUSR00C"
          title="List Users"
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
          {/* Header de búsqueda */}
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              List Users
            </Typography>
            
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Search User ID:
              </Typography>
              
              <TextField
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="Enter User ID"
                size="small"
                disabled={loading}
                inputProps={{
                  maxLength: 8,
                  style: { 
                    textAlign: 'center', 
                    fontSize: '1rem', 
                    fontWeight: 600,
                    color: theme.palette.common.black,
                  },
                }}
                sx={{
                  width: 150,
                  bgcolor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.secondary.main,
                        borderWidth: 2,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Información de paginación como en mainframe */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {searchCriteria && (
                <>Search: <strong>{searchCriteria}</strong> • </>
              )}
              Showing {users.length} users
            </Typography>
            
            <Chip
              label={`Page: ${pagination.page}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* ✅ Tabla con Select para selecciones (más moderno pero funcional) */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                    Selection
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                    User ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>
                    First Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>
                    Last Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                    Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Líneas separadoras como en mainframe */}
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>---------</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>--------</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>--------------------</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>--------------------</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>----</TableCell>
                </TableRow>

                {users.map((user) => (
                  <TableRow
                    key={user.userId}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                      '&:nth-of-type(even)': {
                        bgcolor: alpha(theme.palette.grey[50], 0.5),
                      },
                    }}
                  >
                    {/* ✅ Select para selección U|D (más user-friendly) */}
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 90 }}>
                        <Select
                          value={userSelections[user.userId] || ''}
                          onChange={(e) => handleSelectionChange(user.userId, e.target.value)}
                          displayEmpty
                          disabled={loading}
                          sx={{
                            '& .MuiSelect-select': {
                              textAlign: 'center',
                              fontWeight: 600,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value="U">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Person fontSize="small" />
                              U - Update
                            </Box>
                          </MenuItem>
                          <MenuItem value="D">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ExitToApp fontSize="small" />
                              D - Delete
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {user.userId}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {user.firstName}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {user.lastName}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={getUserTypeLabel(user.userType)}
                        size="small"
                        color={getUserTypeColor(user.userType)}
                        icon={getUserTypeIcon(user.userType)}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Rellenar filas vacías hasta 10 (como mainframe) */}
                {Array.from({ length: Math.max(0, 10 - users.length) }).map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 90 }}>
                        <Select
                          value=""
                          disabled
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Error Display */}
          {error && (
            <Box sx={{ p: 3 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Instrucciones exactas del mainframe */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.3),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', fontWeight: 500 }}
            >
              Select 'U' to Update or 'D' to Delete a User from the list
            </Typography>
          </Box>

          {/* Footer con controles exactos del mainframe */}
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
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<KeyboardReturn />}
                  onClick={handleEnterKey}
                  disabled={loading}
                  color="primary"
                >
                  ENTER = Continue
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<NavigateBefore />}
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev || loading}
                >
                  F7 = Backward
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<NavigateNext />}
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext || loading}
                >
                  F8 = Forward
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExitToApp />}
                  onClick={onExit}
                  disabled={loading}
                >
                  F3 = Back
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}