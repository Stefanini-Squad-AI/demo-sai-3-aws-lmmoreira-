import React from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  showMessage?: boolean;
}

export function LoadingSpinner({
  message = "Loading...",
  size = 40,
  fullScreen = true,
  color = 'primary',
  variant = 'indeterminate',
  value,
  showMessage = true,
}: LoadingSpinnerProps) {
  const content = (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          ...(fullScreen && {
            minHeight: "100vh",
            width: "100%",
          }),
        }}
      >
        <CircularProgress 
          size={size} 
          color={color}
          variant={variant}
          value={value}
        />
        {showMessage && message && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              maxWidth: 300,
              px: 2 
            }}
          >
            {message}
          </Typography>
        )}
        {variant === 'determinate' && value !== undefined && (
          <Typography variant="caption" color="text.secondary">
            {Math.round(value)}%
          </Typography>
        )}
      </Box>
    </Fade>
  );

  return content;
}