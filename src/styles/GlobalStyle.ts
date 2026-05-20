import { createGlobalStyle } from 'styled-components'
import { scrollbarStyle } from './shared'

export const GlobalStyle = createGlobalStyle`
  :root {
    --ui-scale: 1;
  }

  @media (min-width: 2560px) {
    :root {
      --ui-scale: 1.5;
    }
  }

  #root {
    zoom: var(--ui-scale);
    height: calc(100vh / var(--ui-scale));
    overflow-y: auto;
    ${scrollbarStyle}
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.colors.bg};
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.2s, color 0.2s;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.9; }
  }

  .loading-text {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.6;
    animation: pulse 1.2s ease-in-out infinite;
  }
`
