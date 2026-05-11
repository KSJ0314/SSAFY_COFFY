import type { Bar, RotatingBar } from './types'

export const bars: Bar[] = []

// [cx, cy, halfLen, angle(rad), angularVelocity(rad/tick, 음수=반시계)]
const rotatingBarData: [number, number, number, number, number][] = [
  [128, 712, 30, 0, -0.04],  // y≈712 좌측 꼭지점, 반시계
  [208, 649, 15, 0,  0.06],  // y≈650 우측 외벽 꼭지점, 시계
  [130, 1360, 22, 0, -0.025], // y≈1360 깔때기 통로 입구, 반시계
]

export const rotatingBars: RotatingBar[] = rotatingBarData.map(
  ([cx, cy, halfLen, angle, angularVelocity]) => ({ cx, cy, halfLen, angle, angularVelocity })
)
