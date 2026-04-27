'use strict'
const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, screen, nativeImage, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const https = require('https')

const isDev = process.env.NODE_ENV === 'development'

const { electronVersion: ELECTRON_VERSION, homepage: HOMEPAGE } = require('../package.json')
const VERSION_URL     = `${HOMEPAGE}/electron-version.json`

let latestVersion = null
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
        const { version } = JSON.parse(data)
        if (isNewer(version, ELECTRON_VERSION)) {
          latestVersion = version
          tray.setContextMenu(buildMenu())
        }
      } catch {}
    })
  }).on('error', () => {})
}

app.setAppUserModelId('com.ssafy.coffy')

// ─── 트레이 아이콘 생성 (없으면 자동 생성) ──────────────────────────────────
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBytes = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])))
  return Buffer.concat([len, typeBytes, data, crcBuf])
}

function createSolidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    row[0] = 0
    for (let x = 0; x < size; x++) {
      row[1 + x * 3] = r
      row[2 + x * 3] = g
      row[3 + x * 3] = b
    }
    rows.push(row)
  }
  const idat = zlib.deflateSync(Buffer.concat(rows))
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', idat), makeChunk('IEND', Buffer.alloc(0))])
}

function ensureIcon() {
  const ico = path.join(__dirname, 'favicon.ico')
  if (fs.existsSync(ico)) return ico
  const png = path.join(__dirname, 'icon.png')
  if (!fs.existsSync(png)) {
    fs.writeFileSync(png, createSolidPNG(32, 114, 63, 23))
  }
  return png
}

// ─── 설정 저장소 (userData/settings.json) ────────────────────────────────────
function getSettingsPath() {
  return path.join(app.getPath('userData'), 'settings.json')
}

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(getSettingsPath(), 'utf-8'))
  } catch {
    return { name: '', class: '', password: '' }
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
    title: opts.title ?? '싸피커피',
    icon: ensureIcon(),
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      zoomFactor: zoom,
    },
  })
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

// ─── 앱 초기화 ───────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  const iconPath = ensureIcon()
  const tray = new Tray(iconPath)
  tray.setToolTip('싸피커피')

  function buildMenu() {
    const openAtLogin = isDev ? false : app.getLoginItemSettings().openAtLogin
    return Menu.buildFromTemplate([
      { label: '싸피커피', enabled: false },
      { type: 'separator' },
      { label: '🛒 주문하기',         click: () => createWindow('order',    '/order',    { width: 660,  height: 900 }) },
      { label: '🛍️ 장바구니',        click: () => createWindow('cart',     '/cart',     { width: 540,  height: 780 }) },
      { label: '📋 주문 목록',        click: () => createWindow('orders',   '/orders',   { width: 900,  height: 800 }) },
      { label: '💬 문의 게시판',      click: () => createWindow('inquiry',  '/inquiry',  { width: 900,  height: 800 }) },
      { label: '📢 공지사항',         click: () => createWindow('notices',  '/notices',  { width: 600,  height: 240 }) },
      { label: '🎰 오늘의 픽업 추첨', click: () => createWindow('pickup',  '/pickup',   { width: 580,  height: 760 }) },
      { type: 'separator' },
      { label: '⚙️ 내 정보 설정',    click: () => createWindow('settings', '/settings', { width: 460,  height: 160, resizable: false }) },
      {
        label: `🚀 컴퓨터 시작 시 자동 실행  ${openAtLogin ? '✓' : ''}`,
        enabled: !isDev,
        click() {
          app.setLoginItemSettings({ openAtLogin: !openAtLogin })
          tray.setContextMenu(buildMenu())
        },
      },
      { type: 'separator' },
      { label: `v${ELECTRON_VERSION}`, enabled: false },
      ...(latestVersion ? [{
        label: `⬆️ 새 버전 v${latestVersion} 다운로드`,
        click: () => shell.openExternal(`https://github.com/KSJ0314/SSAFY_COFFY/releases/download/electron-v${latestVersion}/SSAFY_COFFEE.exe`),
      }] : []),
      { type: 'separator' },
      { label: '종료', click: () => app.quit() },
    ])
  }

  tray.setContextMenu(buildMenu())
  tray.on('double-click', () => createWindow('order', '/order', { width: 660, height: 900 }))

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
})

// ─── IPC 핸들러 ───────────────────────────────────────────────────────────────
ipcMain.on('open-cart',     () => createWindow('cart',     '/cart',     { width: 540, height: 780 }))

ipcMain.on('resize-window', (event, w, h) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const zoom = win.webContents.getZoomFactor()
  win.setContentSize(Math.round(w * zoom), Math.round(h * zoom))
  const [actualW, actualH] = win.getSize()
  const { workArea } = screen.getPrimaryDisplay()
  win.setPosition(workArea.x + workArea.width - actualW - WINDOW_MARGIN, workArea.y + workArea.height - actualH - WINDOW_MARGIN)
})
ipcMain.on('open-settings', () => createWindow('settings', '/settings', { width: 420, height: 370, resizable: false }))

ipcMain.handle('get-settings', () => loadSettings())
ipcMain.handle('save-settings', (_, data) => { persistSettings(data); return true })

ipcMain.on('notify-pickup', (_, winners) => {
  if (!Notification.isSupported()) return

  const names = winners.map(w => `${w.name}(${w.class}반)`).join(', ')
  const note = new Notification({
    title: '☕ 싸피커피 - 오늘의 픽업 당첨!',
    body: `🎉 ${names}`,
    icon: path.join(__dirname, 'icon.png'),
  })

  note.on('click', () => {
    createWindow('pickup', '/pickup', { width: 580, height: 760 })
  })

  note.show()
})

// 창이 모두 닫혀도 트레이로 계속 실행
app.on('window-all-closed', e => e.preventDefault())
