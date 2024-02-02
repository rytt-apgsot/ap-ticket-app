import { createTheme } from "@mui/material";

// Define your base theme
const baseTheme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: 13,
  },
  palette: {
    type: "light",
    background: {
      default: "#f2f2f2",
    },
    primary: {
      main: "#22da7e",
      thin: "#959595",
    },
    secondary: {
      main: "#000",
    },
    danger: {
      main: "red",
    },
    darkText: {
      main: "#101010",
    },
    light: {
      main: "#000",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": "red",
          "--TextField-brandBorderHoverColor": "#B2BAC2",
          "--TextField-brandBorderFocusedColor": "#6F7E8C",
          "& label.Mui-focused": {
            color: "var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontFamily: '"Poppins", sans-serif',
        boxShadow: "none",
      },
    },
    MuiCardActionArea: {
      root: {
        fontFamily: '"Poppins", sans-serif',
      },
    },
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: "red", // Define your desired border color
        },
        "&:hover $notchedOutline": {
          borderColor: "red", // Define your desired hover border color
        },
      },
    },
  },
});

// Define a dark mode theme by extending the base theme
const darkTheme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: 13,
  },
  palette: {
    type: "dark",
    background: {
      default: "#151515",
    },
    primary: {
      main: "#22da7e",
      thin: "#959595",
    },
    secondary: {
      main: "#fff",
    },
    danger: {
      main: "#f93e50",
    },
    darkText: {
      main: "#22da7e",
    },
    light: {
      main: "#fff",
    },
    dark: {
      main: "#1f1f1f",
      thin: "#1f1f1f",
      light: "#1f1f1f",
      dark: "#1f1f1f",
      contrastText: "#1f1f1f",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": "red",
          "--TextField-brandBorderHoverColor": "#B2BAC2",
          "--TextField-brandBorderFocusedColor": "#6F7E8C",
          "& label.Mui-focused": {
            color: "var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontFamily: '"Poppins", sans-serif',
        boxShadow: "none",
      },
    },
    MuiCardActionArea: {
      root: {
        fontFamily: '"Poppins", sans-serif',
      },
    },
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: "red", // Define your desired border color
        },
        "&:hover $notchedOutline": {
          borderColor: "red", // Define your desired hover border color
        },
      },
    },
  },
});

export { baseTheme, darkTheme };
