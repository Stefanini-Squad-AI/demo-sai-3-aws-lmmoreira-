// app/components/transaction/TransactionReportsScreen.tsx
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stack,
  Divider,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Assessment,
  DateRange,
  CalendarMonth,
  CalendarToday,
  Send,
  Clear,
  ExitToApp,
  CheckCircle,
  Cancel,
  Download,
  Close,
  Print,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { TransactionReportTable } from './TransactionReportTable';
import { useTransactionReports } from '~/hooks/useTransactionReports';

interface TransactionReportsScreenProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function TransactionReportsScreen({
  onSuccess,
  onError,
}: TransactionReportsScreenProps) {
  const theme = useTheme();
  
  const hookOptions = {
    ...(onSuccess && { onSuccess }),
    ...(onError && { onError }),
  };
  
  const {
    reportType,
    startDate,
    endDate,
    confirmation,
    validationErrors,
    loading,
    reportData,
    showReport,
    handleReportTypeSelect,
    handleDateChange,
    handleConfirmationChange,
    handleSubmit,
    handleClear,
    handleCloseReport,
    handleDownloadPDF,
    handleExit,
  } = useTransactionReports(hookOptions);

  const today = new Date().toISOString().split('T')[0];

  // If there is report data, show the dialog with the table
  if (showReport && reportData) {
    return (
      <Dialog
        open={showReport}
        onClose={handleCloseReport}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Typography variant="h6" component="div">
            Transaction Report - {reportData.reportType}
          </Typography>
          <IconButton onClick={handleCloseReport} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <TransactionReportTable reportData={reportData} />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            color="primary"
          >
            Download TXT
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseReport}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <SystemHeader
        transactionId="CR00"
        programName="CORPT00C"
        title="CardDemo - Transaction Reports"
        subtitle="Generate Transaction Reports"
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
            <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
            Transaction Reports
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Report Type Selection */}
          <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600, 
                    color: 'primary.main',
                    mb: 2 
                  }}
                >
                  Select Report Type
                </FormLabel>
                <RadioGroup
                  value={reportType || ''}
                  onChange={(e) => handleReportTypeSelect(e.target.value as any)}
                >
                  <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth color="primary" />
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Monthly (Current Month)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Generate report for the current month
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ mb: 1, p: 1, borderRadius: 1 }}
                  />
                  
                  <FormControlLabel
                    value="yearly"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday color="primary" />
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Yearly (Current Year)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Generate report for the current year
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ mb: 1, p: 1, borderRadius: 1 }}
                  />
                  
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateRange color="primary" />
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Custom (Date Range)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Generate report for a specific date range
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ p: 1, borderRadius: 1 }}
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Date Fields for Custom Report */}
          {reportType === 'custom' && (
            <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  color="primary.main"
                  sx={{ mb: 3 }}
                >
                  Date Range Selection
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Start Date"
                      value={startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      error={!!validationErrors.startDate}
                      helperText={validationErrors.startDate}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max: today }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      value={endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      error={!!validationErrors.endDate}
                      helperText={validationErrors.endDate}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max: today }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Confirmation */}
          {reportType && (
            <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography 
                  variant="body1" 
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  The Report will be submitted for printing. Please confirm:
                </Typography>
                
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={confirmation}
                    onChange={(e) => handleConfirmationChange(e.target.value as any)}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircle color="success" fontSize="small" />
                          Yes
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Cancel color="error" fontSize="small" />
                          No
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
                
                {validationErrors.confirmation && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {validationErrors.confirmation}
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* General Errors */}
          {Object.keys(validationErrors).length > 0 && 
           !validationErrors.confirmation && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Please correct the errors above before proceeding.
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Send />}
              onClick={handleSubmit}
              disabled={!reportType || loading}
              sx={{
                minWidth: 150,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {loading ? 'Processing...' : 'Generate Report'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={loading}
              sx={{
                minWidth: 150,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Clear
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<ExitToApp />}
              onClick={handleExit}
              disabled={loading}
              sx={{
                minWidth: 150,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Exit (F3)
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}