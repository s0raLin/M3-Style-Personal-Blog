import { createTheme } from '@mui/material/styles';
import { DynamicTheme } from '../utils/themeGenerator';

export const createDynamicM3Theme = (dynamicTheme: DynamicTheme) => {
  const { colors, scheme } = dynamicTheme;

  return createTheme({
    palette: {
      mode: scheme,
      primary: {
        main: colors.primary,
        contrastText: colors.onPrimary,
        light: colors.primaryContainer,
        dark: colors.primary,
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors.onSecondary,
        light: colors.secondaryContainer,
        dark: colors.secondary,
      },
      error: {
        main: colors.error,
        contrastText: colors.onError,
        light: colors.errorContainer,
        dark: colors.error,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.onSurface,
        secondary: colors.onSurfaceVariant,
      },
      divider: colors.outlineVariant,
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Roboto", "Noto Sans SC", sans-serif',
      h1: {
        fontSize: '3.5rem',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontSize: '2.75rem',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '0px',
      },
      h3: {
        fontSize: '2.25rem',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '0px',
      },
      h4: {
        fontSize: '1.75rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0.25px',
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0px',
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0.15px',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.15px',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.1px',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.5px',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.25px',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.1px',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: '0.4px',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '1px',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            padding: '10px 24px',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            backgroundColor: colors.primary,
            color: colors.onPrimary,
            '&:hover': {
              backgroundColor: colors.primary,
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            },
          },
          outlined: {
            borderColor: colors.outline,
            color: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary + '14',
              borderColor: colors.outline,
            },
          },
          text: {
            color: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary + '14',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: colors.surface,
            boxShadow: scheme === 'light'
              ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
              : '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            backgroundImage: 'none',
          },
          elevation0: {
            boxShadow: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          filled: {
            backgroundColor: colors.primaryContainer,
            color: colors.onPrimaryContainer,
          },
          outlined: {
            borderColor: colors.outline,
            color: colors.onSurface,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: colors.surface,
              '& fieldset': {
                borderColor: colors.outline,
              },
              '&:hover fieldset': {
                borderColor: colors.onSurface,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            color: colors.onSurface,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.14)',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.24), 0px 8px 16px rgba(0, 0, 0, 0.16)',
            },
          },
          primary: {
            backgroundColor: colors.primaryContainer,
            color: colors.onPrimaryContainer,
          },
        },
      },
    },
  });
};
