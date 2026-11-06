import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563EB",
    },

    secondary: {
      main: "#1E293B",
    },

    success: {
      main: "#16A34A",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#DC2626",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },

    divider: "#E2E8F0",
  },

  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",

    h4: {
      fontWeight: 700,
      color: "#0F172A",
    },

    h5: {
      fontWeight: 700,
      color: "#0F172A",
    },

    h6: {
      fontWeight: 600,
      color: "#0F172A",
    },

    subtitle1: {
      color: "#475569",
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.92rem",
    },
  },

  shape: {
    borderRadius: 14,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(15,23,42,0.04)",
    "0 2px 6px rgba(15,23,42,0.06)",
    "0 6px 16px rgba(15,23,42,0.08)",
    "0 10px 24px rgba(15,23,42,0.10)",
    ...Array(20).fill("0 10px 30px rgba(15,23,42,0.08)"),
  ],

  components: {

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 18,
          height: 42,
          fontWeight: 600,
        },

        containedPrimary: {
          "&:hover": {
            backgroundColor: "#1D4ED8",
          },
        },

        outlined: {
          borderColor: "#CBD5E1",

          "&:hover": {
            borderColor: "#94A3B8",
            backgroundColor: "#F8FAFC",
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",

          "& fieldset": {
            borderColor: "#CBD5E1",
          },

          "&:hover fieldset": {
            borderColor: "#94A3B8",
          },

          "&.Mui-focused fieldset": {
            borderWidth: "1px",
            borderColor: "#2563EB",
          },
        },

        input: {
          paddingTop: 11,
          paddingBottom: 11,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: 8,
        },
      },
    },

    MuiDataGrid: {
      styleOverrides: {

        root: {
          border: "1px solid #E2E8F0",
          borderRadius: 18,
          backgroundColor: "#FFFFFF",
        },

        columnHeaders: {
          backgroundColor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          color: "#334155",
          fontSize: "0.85rem",
          fontWeight: 700,
        },

        cell: {
          borderBottom: "1px solid #F1F5F9",
        },

        row: {
          "&:hover": {
            backgroundColor: "#F8FAFC",
          },
        },

        footerContainer: {
          borderTop: "1px solid #E2E8F0",
        },
      },
    },
  },
});

export default theme;