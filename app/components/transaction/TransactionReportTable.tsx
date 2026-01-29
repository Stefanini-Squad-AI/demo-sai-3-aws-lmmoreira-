// app/components/transaction/TransactionReportTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { formatCurrency, formatDateTime } from '~/utils';
import type { ReportData, AccountGroup, Transaction } from '~/types/transactionReports';

interface TransactionReportTableProps {
  reportData: ReportData;
}

export function TransactionReportTable({ reportData }: TransactionReportTableProps) {
  const theme = useTheme();

  const formatTransactionId = (id: string) => {
    return id.replace(/^0+/, '') || '0';
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getAmountColor = (amount: number) => {
    if (amount < 0) return theme.palette.error.main;
    if (amount > 1000) return theme.palette.success.main;
    return theme.palette.text.primary;
  };

  const renderAccountGroup = (accountGroup: AccountGroup, groupIndex: number) => (
    <React.Fragment key={`account-${accountGroup.accountId}`}>
      {/* Separator between account groups */}
      {groupIndex > 0 && (
        <TableRow>
          <TableCell 
            colSpan={8} 
            sx={{ 
              borderBottom: `2px solid ${theme.palette.divider}`,
              padding: 0,
              height: 8,
            }} 
          />
        </TableRow>
      )}

      {/* Account transactions */}
      {accountGroup.transactions.map((transaction: Transaction, txIndex: number) => (
        <TableRow
          key={`tx-${transaction.transactionId}`}
          sx={{
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            backgroundColor: transaction.amount < 0 
              ? alpha(theme.palette.error.main, 0.02)
              : 'inherit',
          }}
        >
          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {formatTransactionId(transaction.transactionId)}
          </TableCell>
          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {formatCardNumber(transaction.cardNumber)}
          </TableCell>
          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem', textAlign: 'center' }}>
            <Chip
              label={transaction.typeCode}
              size="small"
              variant="outlined"
              color={transaction.typeCode === '03' ? 'error' : 'primary'}
            />
          </TableCell>
          <TableCell sx={{ fontSize: '0.875rem' }}>
            {transaction.typeDescription}
          </TableCell>
          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem', textAlign: 'center' }}>
            {transaction.categoryCode.toString().padStart(3, '0')}
          </TableCell>
          <TableCell sx={{ fontSize: '0.875rem' }}>
            {transaction.categoryDescription}
          </TableCell>
          <TableCell sx={{ fontSize: '0.875rem' }}>
            {transaction.source}
          </TableCell>
          <TableCell 
            sx={{ 
              fontFamily: 'monospace', 
              fontSize: '0.875rem', 
              textAlign: 'right',
              fontWeight: 600,
              color: getAmountColor(transaction.amount),
            }}
          >
            {formatCurrency(transaction.amount)}
          </TableCell>
        </TableRow>
      ))}

      {/* Account total */}
      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.08) }}>
        <TableCell colSpan={6} sx={{ fontWeight: 600, borderTop: `1px solid ${theme.palette.divider}` }}>
          ACCOUNT TOTAL ({accountGroup.transactionCount} transactions)
        </TableCell>
        <TableCell sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
        <TableCell 
          sx={{ 
            fontFamily: 'monospace', 
            fontSize: '0.875rem', 
            textAlign: 'right',
            fontWeight: 700,
            borderTop: `1px solid ${theme.palette.divider}`,
            color: getAmountColor(accountGroup.accountTotal),
          }}
        >
          {formatCurrency(accountGroup.accountTotal)}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

  return (
    <Box>
      {/* Report header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
          DETAILED TRANSACTION REPORT
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 2 }}>
          <Typography variant="body2">
            <strong>Type:</strong> {reportData.reportType}
          </Typography>
          <Typography variant="body2">
            <strong>Period:</strong> {formatDateTime(reportData.startDate)} - {formatDateTime(reportData.endDate)}
          </Typography>
          <Typography variant="body2">
            <strong>Accounts:</strong> {reportData.accountCount}
          </Typography>
          <Typography variant="body2">
            <strong>Transactions:</strong> {reportData.totalTransactionCount}
          </Typography>
        </Box>
      </Paper>

      {/* Transaction table */}
      <TableContainer 
        component={Paper} 
        elevation={2}
        sx={{ 
          maxHeight: '70vh',
          '& .MuiTableCell-head': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120 }}>TRANS ID</TableCell>
              <TableCell sx={{ minWidth: 180 }}>CARD NUMBER</TableCell>
              <TableCell sx={{ minWidth: 80, textAlign: 'center' }}>TYPE</TableCell>
              <TableCell sx={{ minWidth: 150 }}>TYPE DESCRIPTION</TableCell>
              <TableCell sx={{ minWidth: 80, textAlign: 'center' }}>CAT</TableCell>
              <TableCell sx={{ minWidth: 200 }}>CATEGORY DESCRIPTION</TableCell>
              <TableCell sx={{ minWidth: 120 }}>SOURCE</TableCell>
              <TableCell sx={{ minWidth: 120, textAlign: 'right' }}>AMOUNT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.accountGroups.map((accountGroup, groupIndex) => 
              renderAccountGroup(accountGroup, groupIndex)
            )}
            
            {/* Grand total */}
            <TableRow sx={{ backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
              <TableCell 
                colSpan={7} 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '1rem',
                  borderTop: `2px solid ${theme.palette.success.main}`,
                  borderBottom: `2px solid ${theme.palette.success.main}`,
                }}
              >
                GRAND TOTAL ({reportData.totalTransactionCount} transactions in {reportData.accountCount} accounts)
              </TableCell>
              <TableCell 
                sx={{ 
                  fontFamily: 'monospace', 
                  fontSize: '1rem', 
                  textAlign: 'right',
                  fontWeight: 700,
                  color: theme.palette.success.main,
                  borderTop: `2px solid ${theme.palette.success.main}`,
                  borderBottom: `2px solid ${theme.palette.success.main}`,
                }}
              >
                {formatCurrency(reportData.grandTotal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}