'use strict'
const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, screen, shell, nativeTheme } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')

const isDev = process.env.NODE_ENV === 'development'

const { electronVersion: ELECTRON_VERSION, homepage: HOMEPAGE } = require('../package.json')
const VERSION_URL     = `${HOMEPAGE}/electron-version.json`

let latestVersion = null
let downloadUrl = null
let bgWin = null

function isNewer(available, current) {
  const p = v => v.split('.').map(Number)
  const [a, b, c] = p(available)
  const [x, y, z] = p(current)
  return a > x || (a === x && b > y) || (a === x && b === y && c > z)
}

function checkUpdate(tray, buildMenu) {
  https.get(VERSION_URL, res => {
    let data = ''
    res.on('data', d => { data += d })
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data)
        if (isNewer(parsed.version, ELECTRON_VERSION)) {
          latestVersion = parsed.version
          downloadUrl = parsed.downloadUrl
          tray.setContextMenu(buildMenu())
        }
      } catch {}
    })
  }).on('error', () => {})
}

app.setName('싸피커피')
app.setAppUserModelId('com.ssafy.coffy')

// ─── 아이콘 경로 ─────────────────────────────────────────────────────────────
function getIconPath() {
  const p = path.join(__dirname, 'favicon.ico')
  // 패키징 시 asarUnpack된 실제 파일시스템 경로를 반환 (OS 직접 접근용)
  return p.includes('app.asar') ? p.replace('app.asar', 'app.asar.unpacked') : p
}

// ─── 설정 저장소 (userData/settings.json) ────────────────────────────────────
function getSettingsPath() {
  return path.join(app.getPath('userData'), 'settings.json')
}

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(getSettingsPath(), 'utf-8'))
  } catch {
    return { name: '', class: '', password: '', theme: 'light' }
  }
}

function persistSettings(data) {
  fs.writeFileSync(getSettingsPath(), JSON.stringify(data, null, 2), 'utf-8')
}

// ─── 창 관리 ─────────────────────────────────────────────────────────────────
const WINDOW_MARGIN = 12
const windows = {}

function getUrl(route) {
  return isDev
    ? `http://localhost:5173/#${route}`
    : `file://${path.join(__dirname, '../dist/index.html')}#${route}`
}

function createWindow(key, route, opts = {}) {
  const zoom = opts.zoomFactor ?? 0.9

  if (windows[key] && !windows[key].isDestroyed()) {
    windows[key].webContents.setZoomFactor(zoom)
    windows[key].show()
    windows[key].focus()
    return windows[key]
  }

  const { workArea } = screen.getPrimaryDisplay()
  const width  = Math.round((opts.width  ?? 1200) * zoom)
  const height = Math.round((opts.height ?? 800)  * zoom)
  const x = workArea.x + workArea.width  - width  - WINDOW_MARGIN
  const y = workArea.y + workArea.height - height - WINDOW_MARGIN

  const win = new BrowserWindow({
    width,
    height,
    x,
    y,
    title: opts.title ?? `SSAFY_COFFEE for Desktop v${ELECTRON_VERSION}`,
    icon: getIconPath(),
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      zoomFactor: zoom,
    },
  })
  win.on('page-title-updated', e => e.preventDefault())
  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomFactor(zoom)
  })
  win.loadURL(getUrl(route))
  if (isDev) {
    win.webContents.on('before-input-event', (_, input) => {
      if (input.key === 'F12') win.webContents.toggleDevTools()
    })
  }
  win.on('closed', () => { delete windows[key] })
  windows[key] = win
  return win
}

// ─── 창 설정 ─────────────────────────────────────────────────────────────────
const WIN_CONFIGS = {
  order:    { route: '/order',    width: 660, height: 900 },
  cart:     { route: '/cart',     width: 540, height: 780 },
  orders:   { route: '/orders',   width: 900, height: 800 },
  inquiry:  { route: '/inquiry',  width: 900, height: 800 },
  notices:  { route: '/notices',  width: 600, height: 240 },
  pickup:   { route: '/pickup',   width: 580, height: 760 },
  settings:   { route: '/settings',   width: 480, height: 180, resizable: false },
  patchnotes: { route: '/patchnotes', width: 480, height: 800 },
}

const openWindow = key => createWindow(key, WIN_CONFIGS[key].route, WIN_CONFIGS[key])

// ─── 중복 실행 방지 ──────────────────────────────────────────────────────────
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.on('second-instance', () => {
  const win = windows['order']
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
  } else {
    openWindow('order')
  }
})

// ─── 앱 초기화 ───────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  const tray = new Tray(getIconPath())
  tray.setToolTip('싸피커피')

  const settings = loadSettings()
  let currentTheme = settings.theme ?? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light')

  function applyTheme(mode) {
    currentTheme = mode
    const s = loadSettings()
    persistSettings({ ...s, theme: mode })
    BrowserWindow.getAllWindows().forEach(w => w.webContents.send('set-theme', mode))
    tray.setContextMenu(buildMenu())
  }

  function buildMenu() {
    const openAtLogin = isDev ? false : app.getLoginItemSettings({ args: ['--hidden'] }).openAtLogin
    const isDark = currentTheme === 'dark'
    return Menu.buildFromTemplate([
      { label: '싸피커피', click: () => shell.openExternal(HOMEPAGE) },
      { type: 'separator' },
      { label: '🛒 주문하기',         click: () => openWindow('order') },
      { label: '🛍️ 장바구니',        click: () => openWindow('cart') },
      { label: '📋 주문 목록',        click: () => openWindow('orders') },
      { label: '💬 자유 게시판',      click: () => openWindow('inquiry') },
      { label: '📢 공지사항',         click: () => openWindow('notices') },
      { label: '📝 패치 노트',        click: () => openWindow('patchnotes') },
      { label: '🎰 오늘의 픽업 추첨', click: () => openWindow('pickup') },
      { type: 'separator' },
      { label: '⚙️ 내 정보 설정',    click: () => openWindow('settings') },
      { label: `🌙 다크 모드  ${isDark ? '✓' : ''}`, click: () => applyTheme(isDark ? 'light' : 'dark') },
      {
        label: `🚀 컴퓨터 시작 시 자동 실행  ${openAtLogin ? '✓' : ''}`,
        enabled: !isDev,
        click() {
          const next = !openAtLogin
          app.setLoginItemSettings({ openAtLogin: next, args: next ? ['--hidden'] : [] })
          tray.setContextMenu(buildMenu())
        },
      },
      { type: 'separator' },
      { label: `v${ELECTRON_VERSION}`, enabled: false },
      ...(latestVersion && downloadUrl ? [{
        label: `⬆️ 새 버전 v${latestVersion} 다운로드`,
        click: () => shell.openExternal(downloadUrl),
      }] : []),
      { type: 'separator' },
      { label: '종료', click: () => app.quit() },
    ])
  }

  tray.setContextMenu(buildMenu())
  tray.on('double-click', () => openWindow('order'))

  const isAutoStart = process.argv.includes('--hidden')
  if (!isAutoStart) openWindow('order')

  // 11:40 당첨자 추첨 및 토스트 알림을 위한 백그라운드 창
  bgWin = new BrowserWindow({
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  bgWin.loadURL(getUrl('/background'))

  if (!isDev) setTimeout(() => checkUpdate(tray, buildMenu), 5000)

  scheduleEntryReminder()
})

function scheduleEntryReminder() {
  const now = new Date()
  const target = new Date()
  target.setHours(8, 58, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  setTimeout(() => {
    if (Notification.isSupported()) {
      new Notification({
        title: '⏰ 아 맞다! 입실!! ⏰',
        icon: getIconPath(),
      }).show()
    }
    scheduleEntryReminder()
  }, target - now)
}

// ─── IPC 핸들러 ───────────────────────────────────────────────────────────────
ipcMain.on('open-cart',     () => openWindow('cart'))
ipcMain.on('open-orders',   () => openWindow('orders'))

ipcMain.on('resize-window', (event, w, h) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const zoom = win.webContents.getZoomFactor()
  win.setContentSize(Math.round(w * zoom), Math.round(h * zoom))
  const [actualW, actualH] = win.getSize()
  const { workArea } = screen.getPrimaryDisplay()
  win.setPosition(workArea.x + workArea.width - actualW - WINDOW_MARGIN, workArea.y + workArea.height - actualH - WINDOW_MARGIN)
})
ipcMain.on('open-settings', () => openWindow('settings'))

ipcMain.handle('get-settings', () => loadSettings())
ipcMain.handle('save-settings', (_, data) => { persistSettings(data); return true })

ipcMain.on('notify-pickup', (_, winners) => {
  if (!Notification.isSupported()) return

  const names = winners.map(w => `${w.name}(${w.class}반)`).join(', ')
  const note = new Notification({
    title: '☕ 싸피커피 - 오늘의 픽업 당첨!',
    body: `🎉 ${names}`,
    icon: getIconPath(),
  })

  note.on('click', () => {
    createWindow('pickup', '/pickup', { width: 580, height: 760 })
  })

  note.show()
})

// 창이 모두 닫혀도 트레이로 계속 실행
app.on('window-all-closed', e => e.preventDefault())
