import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { Home as HomeIcon, Dashboard } from "@mui/icons-material";
import { ThemeToggle } from "~/components/ui/ThemeToggle";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h3" component="h1" fontWeight={700}>
            React SPA Application
          </Typography>
          <ThemeToggle />
        </Box>

        <Stack spacing={4}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <HomeIcon
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography variant="h4" gutterBottom>
              Application Ready for Development
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Clean React 18.3.1 SPA with React Router v6, Redux Toolkit, Material-UI, and MSW configured for authenticated users only.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Dashboard />}
              sx={{ mt: 2 }}
            >
              Start Building
            </Button>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tech Stack Configured
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
                mt: 2,
              }}
            >
              {techStack.map((tech) => (
                <Box
                  key={tech.name}
                  sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {tech.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tech.version}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}

const techStack = [
  { name: "React", version: "18.3.1" },
  { name: "React Router", version: "6.22.0" },
  { name: "Redux Toolkit", version: "2.2.1" },
  { name: "Material-UI", version: "5.15.11" },
  { name: "TypeScript", version: "5.3.3" },
  { name: "MSW", version: "2.1.5" },
  { name: "Vite", version: "5.0.11" },
];