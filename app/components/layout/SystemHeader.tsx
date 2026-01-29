import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Home,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { 
  logoutUser, 
  selectCurrentUser, 
  selectIsAuthenticated 
} from '~/features/auth/authSlice';
import { formatDate } from '~/utils';

interface SystemHeaderProps {
  transactionId: string;
  programName: string;
  title: string;
  subtitle?: string | undefined; // ✅ CORRECCIÓN: Tipo explícito para exactOptionalPropertyTypes
  showNavigation?: boolean;
}

export function SystemHeader({
  transactionId,
  programName,
  title,
  subtitle,
  showNavigation = true,
}: SystemHeaderProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentDate = new Date();

  const handleHomeClick = () => {
    if (user?.role === 'admin') {
      navigate('/menu/admin');
    } else {
      navigate('/menu/main');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Solo mostrar botones si está autenticado y showNavigation es true
  const shouldShowNavigation = isAuthenticated && user && showNavigation;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary.main"
              gutterBottom
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Tran: ${transactionId}`}
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                label={`Prog: ${programName}`}
                size="small"
                variant="outlined"
                color="secondary"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label={formatDate(currentDate)}
                size="small"
                variant="filled"
                sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}
              />
              <Chip
                label={currentDate.toLocaleTimeString()}
                size="small"
                variant="filled"
                sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}
              />
              
              {/* Solo mostrar botones si está autenticado */}
              {shouldShowNavigation && (
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={handleHomeClick}
                    sx={{ borderRadius: 2 }}
                  >
                    Home
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<ExitToApp />}
                    onClick={handleLogout}
                    sx={{ borderRadius: 2 }}
                  >
                    Logout
                  </Button>
                </Stack>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}