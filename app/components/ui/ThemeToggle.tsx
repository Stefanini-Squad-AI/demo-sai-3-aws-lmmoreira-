import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material";
import { useTheme } from "~/providers/AppProviders";

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (mode) {
      case "light":
        return <LightMode />;
      case "dark":
        return <DarkMode />;
      case "system":
        return <SettingsBrightness />;
      default:
        return <LightMode />;
    }
  };

  const getTooltip = () => {
    switch (mode) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  return (
    <Tooltip title={getTooltip()}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
