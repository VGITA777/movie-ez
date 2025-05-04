import {definePreset, palette} from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const PRIMARY_PALETTE = palette("#F7374F")

export const MyTheme = definePreset(Aura, {
  semantic: {
    primary: PRIMARY_PALETTE,
    dark: {
      surface: {
        50: '#F5F5F5',
        100: '#E6E6E6',
        200: '#CCCCCC',
        300: '#B3B3B3',
        400: '#999999',
        500: '#808080',
        600: '#666666',
        700: '#4D4D4D',
        800: '#333333',
        900: '#2C2C2C',
        950: '#1A1A1A'
      }
    },
    light: {
      surface: {
        50: '#F5F5F5',
        100: '#E6E6E6',
        200: '#CCCCCC',
        300: '#B3B3B3',
        400: '#999999',
        500: '#808080',
        600: '#666666',
        700: '#4D4D4D',
        800: '#333333',
        900: '#2C2C2C',
        950: '#1A1A1A'
      }
    }
  }
})
