import { useState, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Alert,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowForwardIos,
  KeyboardReturn,
  ExitToApp,
  AdminPanelSettings,
  Dashboard,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { useAppDispatch } from '~/store/hooks';
import { logoutUser } from '~/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import type { MenuData, MenuOption } from '~/types/menu';

interface MenuScreenProps {
  menuData: MenuData;
  onOptionSelect: (option: MenuOption) => void;
  onExit?: () => void;
  error?: string | null;
  loading?: boolean;
}

export function MenuScreen({
  menuData,
  onOptionSelect,
  onExit,
  error,
  loading = false,
}: MenuScreenProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedInput, setSelectedInput] = useState('');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow numbers and maximum 2 digits
    if (/^\d{0,2}$/.test(value)) {
      setSelectedInput(value);
    }
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedInput) return;
    
    const optionIndex = parseInt(selectedInput) - 1;
    const selectedOption = menuData.options[optionIndex];
    
    if (selectedOption && !selectedOption.disabled) {
      onOptionSelect(selectedOption);
    }
  }, [selectedInput, menuData.options, onOptionSelect]);

  const handleOptionClick = useCallback((option: MenuOption) => {
    if (!option.disabled) {
      onOptionSelect(option);
    }
  }, [onOptionSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || (event.key === 'Escape')) {
      event.preventDefault();
      if (onExit) {
        onExit();
      } else {
        // Default logout if no onExit provided
        dispatch(logoutUser());
        navigate('/login');
      }
    }
  }, [onExit, dispatch, navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId={menuData.transactionId}
          programName={menuData.programName}
          title={menuData.title}
          subtitle={menuData.subtitle || undefined}
        />

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          }}
        >
          {/* Menu Title */}
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              {menuData.title.includes('Admin') ? (
                <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
              ) : (
                <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
              )}
              Select an Option
            </Typography>
          </Box>

          {/* Options List */}
          <Box sx={{ p: 3 }}>
            <List sx={{ mb: 3 }}>
              {menuData.options.map((option, index) => (
                <ListItem key={option.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled || loading}
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 2,
                      transition: 'all 0.2s ease-in-out',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: theme.shadows[4],
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&.Mui-disabled': {
                        opacity: 0.5,
                        bgcolor: alpha(theme.palette.grey[500], 0.1),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Chip
                        label={index + 1}
                        size="small"
                        color={hoveredOption === option.id ? 'primary' : 'default'}
                        sx={{
                          fontWeight: 600,
                          minWidth: 28,
                          height: 28,
                        }}
                      />
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={option.label}
                      secondary={option.description}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: option.disabled ? 'text.disabled' : 'text.primary',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.875rem',
                        color: option.disabled ? 'text.disabled' : 'text.secondary',
                      }}
                    />
                    
                    {option.adminOnly && (
                      <Chip
                        label="Admin"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    )}
                    
                    <ArrowForwardIos
                      sx={{
                        fontSize: 16,
                        color: option.disabled ? 'text.disabled' : 'action.active',
                        opacity: hoveredOption === option.id ? 1 : 0.5,
                        transition: 'opacity 0.2s',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Manual Input */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight={600}
              >
                Enter your selection:
              </Typography>
              
              <TextField
                value={selectedInput}
                onChange={handleInputChange}
                placeholder="01"
                size="small"
                disabled={loading}
                inputProps={{
                  maxLength: 2,
                  style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 },
                }}
                sx={{
                  width: 80,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
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
                disabled={!selectedInput || loading}
                startIcon={<KeyboardReturn />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                }}
              >
                Continue
              </Button>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  },
                }}
              >
                {error}
              </Alert>
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
                ENTER = Continue
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExitToApp />}
                onClick={onExit || (() => {
                  dispatch(logoutUser());
                  navigate('/login');
                })}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                F3 = Exit
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}