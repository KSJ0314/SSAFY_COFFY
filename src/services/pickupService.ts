import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { Order } from '../context/OrderContext'

function getTodayKST(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

export type DrawEntry = {
  name: string
  class: string
  randomValue: number
}

export type PickupResult = {
  winners: Order[]
  draws: DrawEntry[]
  drawnAt: string
}

export async function getTodayPickup(): Promise<PickupResult | null> {
  const today = getTodayKST()
  const snap = await getDoc(doc(db, 'winners', today))
  return snap.exists() ? (snap.data() as PickupResult) : null
}

export async function savePickupResult(result: PickupResult): Promise<boolean> {
  const today = getTodayKST()
  const ref = doc(db, 'winners', today)
  try {
    await setDoc(ref, result)
    return true
  } catch {
    return false
  }
}

export async function sendPickupNotification(result: PickupResult, totalOrders: number): Promise<void> {
  const webhookUrl = import.meta.env.VITE_MM_WEBHOOK_URL
  if (!webhookUrl) return

  const today = getTodayKST()
  const [year, month, day] = today.split('-')
  const dateStr = `${year}년 ${Number(month)}월 ${Number(day)}일`
  const winnerText = result.winners.map(w => `* **${w.name}** (${w.class}반)`).join('\n')

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color: '#723F17',
        title: `${dateStr} 오늘의 픽업 당첨자 발표 ☕`,
        text: `${winnerText}\n\n13:00에 게이트 앞 자전거 보관소에서 커피 받아와주세요~`,
        footer: `총 ${totalOrders}건 주문 · ${result.winners.length}명 당첨`,
      }],
    }),
  })
}

export function drawPickup(orders: Order[]): PickupResult {
  const unique = orders.filter((o, _, arr) =>
    arr.findIndex(x => x.name === o.name && x.class === o.class) === arr.indexOf(o)
  )

  const draws: DrawEntry[] = unique.map(o => ({
    name: o.name,
    class: o.class,
    randomValue: Math.random(),
  }))

  const sorted = draws.sort((a, b) => b.randomValue - a.randomValue)
  const winnerCount = Math.max(1, Math.ceil(orders.length * 0.15))
  const topDraws = sorted.slice(0, winnerCount)
  const winners = topDraws.map(d => unique.find(o => o.name === d.name && o.class === d.class)!)

  return {
    winners,
    draws: sorted,
    drawnAt: new Date().toISOString(),
  }
}
