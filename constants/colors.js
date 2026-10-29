// constants/colors.js
// Duas paletas (clara e escura). O ThemeContext escolhe qual usar.
// `title` = cor de títulos/ícones que antes usavam `primary` como texto.

export const lightColors = {
  primary: '#0B1F33',       // azul escuro principal (fundos de cabeçalho)
  secondary: '#162C46',
  accent: '#E63963',        // rosa/vermelho destaque
  accentLight: '#ff5f87',

  background: '#F4F7FB',
  white: '#FFFFFF',         // usado como cor de TEXTO sobre fundos coloridos
  card: '#FFFFFF',
  border: '#E2E8F0',
  subtext: '#94A3B8',

  text: '#1A1A1A',
  textLight: '#6B7280',
  title: '#0B1F33',

  success: '#22C55E',
  warning: '#F59E0B',
};

export const darkColors = {
  primary: '#0B1F33',
  secondary: '#162C46',
  accent: '#E63963',
  accentLight: '#ff5f87',

  background: '#0A101C',
  white: '#FFFFFF',
  card: '#141D2E',
  border: '#26324A',
  subtext: '#7C8BA3',

  text: '#F1F5F9',
  textLight: '#9AA8BD',
  title: '#E2E8F0',

  success: '#22C55E',
  warning: '#F59E0B',
};

// Compatibilidade: arquivos que ainda importam o padrão recebem a paleta clara.
const COLORS = lightColors;
export default COLORS;
