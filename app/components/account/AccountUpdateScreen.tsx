// app/components/account/AccountUpdateScreen.tsx
import { useState, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import {
  Search,
  AccountBalance,
  Person,
  CreditCard,
  Phone,
  CalendarToday,
  AttachMoney,
  KeyboardReturn,
  ExitToApp,
  Save,
  Refresh,
  Edit,
  Info,
  Warning,
  CheckCircle,
  Home,
  Badge,
  CreditScore,
  ContactPhone,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import type { AccountUpdateRequest, AccountUpdateData } from '~/types/accountUpdate';

interface AccountUpdateScreenProps {
  onSearch: (request: AccountUpdateRequest) => void;
  onUpdate: (data: AccountUpdateData) => void;
  onExit?: () => void;
  accountData?: AccountUpdateData | null;
  hasChanges?: boolean;
  loading?: boolean;
  error?: string | null;
  onDataChange?: (updates: Partial<AccountUpdateData>) => void;
  onReset?: () => void;
}

export function AccountUpdateScreen({
  onSearch,
  onUpdate,
  onExit,
  accountData,
  hasChanges = false,
  loading = false,
  error,
  onDataChange,
  onReset,
}: AccountUpdateScreenProps) {
  const theme = useTheme();
  const [accountId, setAccountId] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Local validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleAccountIdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // if (/^\d{0,11}$/.test(value)) {
      setAccountId(value);
      setFieldError(null);
    // }
  }, []);

  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    if (!accountId.trim()) {
      setFieldError('Account number not provided');
      return;
    }
    
    // if (accountId.length !== 11 || accountId === '00000000000') {
    //   setFieldError('Account number must be a non zero 11 digit number');
    //   return;
    // }
    
    onSearch({ accountId });
    setEditMode(false);
  }, [accountId, onSearch]);

  const handleFieldChange = useCallback((field: keyof AccountUpdateData, value: any) => {
    if (!onDataChange || !accountData) return;

    // Basic local validation
    const errors = { ...validationErrors };
    
    // Field-specific validations
    switch (field) {
      case 'creditLimit':
      case 'cashCreditLimit':
      case 'currentBalance':
        if (value && isNaN(Number(value))) {
          errors[field] = 'Must be a valid number';
        } else {
          delete errors[field];
        }
        break;
      case 'activeStatus':
        if (value && !['Y', 'N'].includes(value)) {
          errors[field] = 'Must be Y or N';
        } else {
          delete errors[field];
        }
        break;
      case 'zipCode':
        if (value && !/^\d{5}(-\d{4})?$/.test(value)) {
          errors[field] = 'Invalid ZIP code format';
        } else {
          delete errors[field];
        }
        break;
    }

    setValidationErrors(errors);
    onDataChange({ [field]: value });
  }, [onDataChange, accountData, validationErrors]);

  const handleUpdate = useCallback(() => {
    if (!accountData || Object.keys(validationErrors).length > 0) return;
    
    setShowConfirmDialog(true);
  }, [accountData, validationErrors]);

  const confirmUpdate = useCallback(() => {
    if (accountData) {
      onUpdate(accountData);
      setShowConfirmDialog(false);
      setEditMode(false);
    }
  }, [accountData, onUpdate]);

  const handleReset = useCallback(() => {
    onReset?.();
    setValidationErrors({});
    setEditMode(false);
  }, [onReset]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit?.();
    } else if (event.key === 'F5' && accountData && hasChanges) {
      event.preventDefault();
      handleUpdate();
    } else if (event.key === 'F12') {
      event.preventDefault();
      handleReset();
    }
  }, [onExit, accountData, hasChanges, handleUpdate, handleReset]);

  const formatCurrency = useCallback((amount?: number) => {
    if (amount === undefined || amount === null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US');
    } catch {
      return dateStr;
    }
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Y': return 'success';
      case 'N': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'Y': return 'Active';
      case 'N': return 'Inactive';
      default: return 'Unknown';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CAUP"
          programName="COACTUPC"
          title="CardDemo - Account Update"
          subtitle="Update Account Information"
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
              Update Account
            </Typography>
          </Box>

          {/* Search Form */}
          <Box sx={{ p: 3 }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 3,
              }}
            >
              <Typography variant="body1" color="primary.main" fontWeight={600}>
                Account Number:
              </Typography>
              
              <TextField
                value={accountId}
                onChange={handleAccountIdChange}
                placeholder="11111111111"
                size="medium"
                disabled={loading}
                error={!!fieldError}
                helperText={fieldError}
                inputProps={{
                  maxLength: 11,
                  style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 200 }}
              />
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <LoadingSpinner size={20} /> : <Search />}
                sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Account Data */}
            {accountData && (
              <>
                {/* Status and Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                      label={getStatusLabel(accountData.activeStatus)}
                      color={getStatusColor(accountData.activeStatus) as any}
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                    {hasChanges && (
                      <Chip
                        label="Unsaved Changes"
                        color="warning"
                        variant="outlined"
                        icon={<Warning />}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editMode}
                        onChange={(e) => setEditMode(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Edit Mode"
                  />
                </Box>

                <Grid container spacing={3}>
                  {/* Account Information */}
                  <Grid item xs={12} lg={6}>
                    <Card elevation={1}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Account Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2}>
                          <TextField
                            label="Account Status"
                            select
                            value={accountData.activeStatus || ''}
                            onChange={(e) => handleFieldChange('activeStatus', e.target.value)}
                            disabled={!editMode}
                            error={!!validationErrors.activeStatus}
                            helperText={validationErrors.activeStatus}
                            size="small"
                            fullWidth
                          >
                            <MenuItem value="Y">Y - Active</MenuItem>
                            <MenuItem value="N">N - Inactive</MenuItem>
                          </TextField>

                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <TextField
                                label="Open Year"
                                value={accountData.openDate ? new Date(accountData.openDate).getFullYear() : ''}
                                onChange={(e) => {
                                  const year = e.target.value;
                                  if (accountData.openDate) {
                                    const date = new Date(accountData.openDate);
                                    date.setFullYear(parseInt(year) || date.getFullYear());
                                    handleFieldChange('openDate', date.toISOString().split('T')[0]);
                                  }
                                }}
                                disabled={!editMode}
                                size="small"
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Open Month"
                                value={accountData.openDate ? new Date(accountData.openDate).getMonth() + 1 : ''}
                                onChange={(e) => {
                                  const month = parseInt(e.target.value) - 1;
                                  if (accountData.openDate) {
                                    const date = new Date(accountData.openDate);
                                    date.setMonth(month);
                                    handleFieldChange('openDate', date.toISOString().split('T')[0]);
                                  }
                                }}
                                disabled={!editMode}
                                size="small"
                                type="number"
                                inputProps={{ min: 1, max: 12 }}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Open Day"
                                value={accountData.openDate ? new Date(accountData.openDate).getDate() : ''}
                                onChange={(e) => {
                                  const day = parseInt(e.target.value);
                                  if (accountData.openDate) {
                                    const date = new Date(accountData.openDate);
                                    date.setDate(day);
                                    handleFieldChange('openDate', date.toISOString().split('T')[0]);
                                  }
                                }}
                                disabled={!editMode}
                                size="small"
                                type="number"
                                inputProps={{ min: 1, max: 31 }}
                              />
                            </Grid>
                          </Grid>

                          <TextField
                            label="Credit Limit"
                            value={accountData.creditLimit || ''}
                            onChange={(e) => handleFieldChange('creditLimit', parseFloat(e.target.value) || 0)}
                            disabled={!editMode}
                            error={!!validationErrors.creditLimit}
                            helperText={validationErrors.creditLimit}
                            size="small"
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />

                          <TextField
                            label="Cash Credit Limit"
                            value={accountData.cashCreditLimit || ''}
                            onChange={(e) => handleFieldChange('cashCreditLimit', parseFloat(e.target.value) || 0)}
                            disabled={!editMode}
                            error={!!validationErrors.cashCreditLimit}
                            helperText={validationErrors.cashCreditLimit}
                            size="small"
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />

                          <TextField
                            label="Account Group"
                            value={accountData.groupId || ''}
                            onChange={(e) => handleFieldChange('groupId', e.target.value)}
                            disabled={!editMode}
                            size="small"
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Customer Information */}
                  <Grid item xs={12} lg={6}>
                    <Card elevation={1}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Customer Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2}>
                          <TextField
                            label="Customer ID"
                            value={accountData.customerId || ''}
                            disabled
                            size="small"
                          />

                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <TextField
                                label="First Name"
                                value={accountData.firstName || ''}
                                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                disabled={!editMode}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Middle Name"
                                value={accountData.middleName || ''}
                                onChange={(e) => handleFieldChange('middleName', e.target.value)}
                                disabled={!editMode}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Last Name"
                                value={accountData.lastName || ''}
                                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                disabled={!editMode}
                                size="small"
                              />
                            </Grid>
                          </Grid>

                          <TextField
                            label="Address Line 1"
                            value={accountData.addressLine1 || ''}
                            onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                            disabled={!editMode}
                            size="small"
                          />

                          <TextField
                            label="Address Line 2"
                            value={accountData.addressLine2 || ''}
                            onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                            disabled={!editMode}
                            size="small"
                          />

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                label="State"
                                value={accountData.stateCode || ''}
                                onChange={(e) => handleFieldChange('stateCode', e.target.value)}
                                disabled={!editMode}
                                size="small"
                                inputProps={{ maxLength: 2 }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="ZIP Code"
                                value={accountData.zipCode || ''}
                                onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                                disabled={!editMode}
                                error={!!validationErrors.zipCode}
                                helperText={validationErrors.zipCode}
                                size="small"
                              />
                            </Grid>
                          </Grid>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                label="Phone 1"
                                value={accountData.phoneNumber1 || ''}
                                onChange={(e) => handleFieldChange('phoneNumber1', e.target.value)}
                                disabled={!editMode}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="Phone 2"
                                value={accountData.phoneNumber2 || ''}
                                onChange={(e) => handleFieldChange('phoneNumber2', e.target.value)}
                                disabled={!editMode}
                                size="small"
                              />
                            </Grid>
                          </Grid>

                          <TextField
                            label="FICO Score"
                            value={accountData.ficoScore || ''}
                            onChange={(e) => handleFieldChange('ficoScore', parseInt(e.target.value) || 0)}
                            disabled={!editMode}
                            size="small"
                            type="number"
                            inputProps={{ min: 300, max: 850 }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleUpdate}
                      disabled={!hasChanges || Object.keys(validationErrors).length > 0}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Save Changes
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={handleReset}
                      disabled={!hasChanges}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Reset
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Footer */}
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
              <Typography variant="body2" color="text.secondary">
                <KeyboardReturn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                ENTER = Search • F5 = Save • F12 = Cancel
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExitToApp />}
                onClick={onExit}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                F3 = Exit
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <CheckCircle color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Confirm Update
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to save the changes to account {accountData?.accountId}?
            </Typography>
            {hasChanges && (
              <Alert severity="info" sx={{ mt: 2 }}>
                This will update both account and customer information in the database.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmUpdate}
              variant="contained"
              startIcon={<Save />}
            >
              Confirm Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}