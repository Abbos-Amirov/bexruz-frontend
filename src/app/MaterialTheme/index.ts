import { createTheme, Theme } from '@mui/material/styles';
import shadow from './shadow';
import typography from './typography';

const RED = '#e11d2e';
const RED_DARK = '#c3101f';
const FONT = '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

/**
 * BEXRUZ theme: qora + qizil. Dark rejim asosiy, light ham qo'llab-quvvatlanadi.
 * Ranglar src/css/bexruz-theme.css dagi tokenlar bilan bir xil.
 */
export function getTheme(mode: 'light' | 'dark'): Theme {
	const dark = mode === 'dark';

	let theme = createTheme({
		palette: {
			mode,
			background: {
				default: dark ? '#0a0a0b' : '#f4f3f1',
				paper: dark ? '#141416' : '#ffffff',
			},
			primary: {
				main: RED,
				dark: RED_DARK,
				contrastText: '#ffffff',
			},
			secondary: {
				main: dark ? '#f5f5f4' : '#0a0a0b',
				contrastText: dark ? '#0a0a0b' : '#ffffff',
			},
			error: { main: RED },
			text: {
				primary: dark ? '#f5f5f4' : '#0a0a0b',
				secondary: dark ? '#a1a1aa' : '#5b5b63',
			},
			divider: dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,11,0.08)',
		},
		shape: { borderRadius: 12 },
		typography: { ...typography, fontFamily: FONT },
		shadows: shadow as Theme['shadows'],
		components: {
			MuiContainer: {
				styleOverrides: {
					root: { height: '100%' },
				},
			},
			MuiCssBaseline: {
				styleOverrides: {
					html: { height: '100%' },
					body: { height: '100%', minHeight: '100%' },
				},
			},
			MuiButton: {
				styleOverrides: {
					root: { textTransform: 'none', fontWeight: 700, borderRadius: 12 },
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: { backgroundImage: 'none' },
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						borderRadius: 14,
						border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,11,0.08)'}`,
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						fontWeight: 600,
						'&.Mui-selected, &.Mui-selected:hover': {
							backgroundColor: 'rgba(225, 29, 46, 0.14)',
							color: RED,
						},
					},
				},
			},
		},
	});

	theme = createTheme(theme, {
		components: {
			MuiContainer: {
				styleOverrides: {
					maxWidthLg: {
						[theme.breakpoints.up('lg')]: {
							maxWidth: '1300px',
						},
					},
				},
			},
		},
	});

	return theme;
}

export default getTheme('dark');
