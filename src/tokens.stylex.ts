import * as stylex from '@stylexjs/stylex';

const DARK = '@media (prefers-color-scheme: dark)';

export const colors = stylex.defineVars({
  primaryColor: { default: 'white', [DARK]: 'black' },
  primaryDarkColor: { default: 'black', [DARK]: 'white' },
  lightGreyColor: { default: '#f3f3f3', [DARK]: '#605e5e' },
});

export const spacing = stylex.defineVars({
  sizeSm: '.25rem',
  sizeXl: '2.5rem',
});
