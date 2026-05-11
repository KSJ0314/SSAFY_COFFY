// ─── 뷰포트 / 월드 크기 ──────────────────────────────────────────────────
export const MARBLE_W  = 280   // 뷰포트 너비 (px) — canvas 실제 width
export const MARBLE_H  = 340   // 뷰포트 높이 (px) — canvas 실제 height
export const WORLD_W   = 280   // 월드 너비 (px)
export const WORLD_H   = 1500  // 월드 높이 (px) — 뷰포트보다 훨씬 큼
export const MINIMAP_W = Math.round(WORLD_W * MARBLE_H / WORLD_H)  // 미니맵 너비 (≈63px)
export const MINIMAP_H = MARBLE_H                                   // 미니맵 높이 = 뷰포트 높이

// ─── 물리 상수 ───────────────────────────────────────────────────────────
export const GRAVITY   = 0.10   // 중력 가속도 (px/frame²) — 클수록 빨리 떨어짐
export const FRICTION  = 0.99  // 속도 감쇠 계수 (0~1) — 낮을수록 빨리 멈춤
export const SUBSTEPS  = 4      // 물리 서브스텝 수 — 높을수록 터널링 방지 (성능 ↓)

// ─── 카메라 ──────────────────────────────────────────────────────────────
export const CAMERA_LERP   = 0.2   // 카메라 추적 속도 (0~1) — 1에 가까울수록 즉시 따라감
export const CAMERA_OFFSET = 0.35  // 선두 구슬을 뷰포트 몇 % 지점에 위치시킬지 (0=상단, 0.5=중앙)

// ─── 구간 트리거 ─────────────────────────────────────────────────────────
export const FUNNEL_Y = 1276  // 깔때기 입구 y좌표 — 이 이하 진입 시 줌/슬로우 효과 적용

// ─── 반발 계수 ───────────────────────────────────────────────────────────
export const REST_WALL = 0.55   // 외곽 벽 반발 계수
export const REST_BAR  = 0.1   // 막대 반발 계수
export const REST_PIN  = 0.65   // 핀 반발 계수
export const REST_BALL = 0.75   // 구슬 간 반발 계수
