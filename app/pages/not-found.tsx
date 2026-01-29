import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { ErrorOutline, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "~/store/hooks";
import { selectIsAuthenticated, selectCurrentUser } from "~/features/auth/authSlice";
import { useEffect } from "react";

export function meta() {
  return [
    { title: "404 - Page Not Found" },
    {
      name: "description",
      content: "The page you're looking for doesn't exist",
    },
  ];
}

export default function NotFoundPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    // Redirigir automáticamente según estado de autenticación
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
    } else {
      const defaultPath = user.role === 'admin' ? '/menu/admin' : '/menu/main';
      navigate(defaultPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Renderizar brevemente mientras se redirige
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            maxWidth: 500,
          }}
        >
          <ErrorOutline
            sx={{
              fontSize: 80,
              color: "error.main",
              mb: 2,
            }}
          />
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}