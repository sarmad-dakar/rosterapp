import { Dimensions } from 'react-native';

export const vw = Dimensions.get('window').width * 0.01;
export const vh = Dimensions.get('window').height * 0.01;

export const reduceString = (str: string, count: number): string => {
    return str.length > count ? str.slice(0, count) + '...' : str;
};

export const isTablet = Dimensions.get('window').width >= 600;

export const lightenColor = (color: string, percent: number): string => {
    // Remove # if present
    let hex = color.replace('#', '');

    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Calculate lighten amount (0-255)
    const amount = Math.floor(2.55 * percent);

    // Lighten each color component
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);

    // Convert back to hex
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
};

export const DATE_CHANGE = 'date_change';
export const DATE_COMPLETION = 'date_completion';
export const TAB_BTN_PRESS = 'tab_btn_press';
export const RESET_DATE_SELECTION = 'reset_date_selection';