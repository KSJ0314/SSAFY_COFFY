export const lightTheme = {
  colors: {
    // 페이지 배경
    bg: '#fdf6ec',
    pageBg: '#f5ede3',
    // 서피스
    surface: '#fff',
    surfaceAlt: '#fff9f3',
    surfaceModal: '#fdf6ec',
    surfaceAccent: '#fdf0e0',
    surfaceSubtle: '#fffaf5',
    surfaceHighlight: '#fff3e0',
    surfaceDisabled: '#f0e8de',
    // 브랜드
    primary: '#4a2810',
    secondary: '#7c4519',
    accent: '#a0622a',
    btnPrimary: '#4a2810',
    // 텍스트
    text: '#3b1f0a',
    textInput: '#2c1a0e',
    label: '#6b3f1a',
    textMuted: '#8c5c30',
    textMutedAlt: '#a07858',
    textFaint: '#c0a080',
    textDisabled: '#b89878',
    btnDisabled: '#c4b0a0',
    textOnPrimary: '#d4a87a',
    textOnDark: '#fff8f0',
    textOnTable: '#fde8c8',
    gold: '#ffd080',
    // 사이드바
    sidebarFrom: '#4a2810',
    sidebarTo: '#7c4519',
    // 테두리
    border: '#d4b896',
    borderLight: '#f0e4d4',
    borderMid: '#e8d4bc',
    borderSubtle: 'rgba(255,255,255,0.2)',
    // 기타
    shadow: 'rgba(74,40,16,0.15)',
    hot: '#ef4444',
    ice: '#3b82f6',
    // ICE 뱃지
    iceBg: '#dbeafe',
    iceText: '#1d4ed8',
    iceBorder: '#93c5fd',
    // HOT 뱃지
    hotBg: '#fee2e2',
    hotText: '#b91c1c',
    hotBorder: '#fca5a5',
  },
} as const

export const darkTheme = {
  colors: {
    // 페이지 배경
    bg: '#1a0f08',
    pageBg: '#1f1008',
    // 서피스
    surface: '#2a1a0e',
    surfaceAlt: '#3a2218',
    surfaceModal: '#2a1a0e',
    surfaceAccent: '#2f1c10',
    surfaceSubtle: '#221408',
    surfaceHighlight: '#3f2418',
    surfaceDisabled: '#251208',
    // 브랜드
    primary: '#d4a87a',
    secondary: '#7a4e20',
    accent: '#a0622a',
    btnPrimary: '#3d1e08',
    // 텍스트
    text: '#f5e6d3',
    textInput: '#f5e6d3',
    label: '#c4a882',
    textMuted: '#b89880',
    textMutedAlt: '#9a8068',
    textFaint: '#5a4030',
    textDisabled: '#6a5848',
    btnDisabled: '#4a3020',
    textOnPrimary: '#1a0f08',
    textOnDark: '#fff8f0',
    textOnTable: '#fde8c8',
    gold: '#ffd080',
    // 사이드바
    sidebarFrom: '#120704',
    sidebarTo: '#2e1208',
    // 테두리
    border: '#4a3020',
    borderLight: '#3a2010',
    borderMid: '#4a3020',
    borderSubtle: 'rgba(255,255,255,0.15)',
    // 기타
    shadow: 'rgba(0,0,0,0.4)',
    hot: '#f87171',
    ice: '#60a5fa',
    // ICE 뱃지
    iceBg: '#1e3a5f',
    iceText: '#3b82f6',
    iceBorder: '#2563eb',
    // HOT 뱃지
    hotBg: '#5f1e1e',
    hotText: '#dc2626',
    hotBorder: '#b91c1c',
  },
} as const

export type Theme = typeof lightTheme
