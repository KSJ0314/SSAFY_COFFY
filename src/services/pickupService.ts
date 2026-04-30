import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { Order } from '../context/OrderContext'
import { MM_USERNAMES } from '../config/mmUsernames'
import siteConfig from '../data/siteConfig.json'
const _exclusionModules = import.meta.glob('../config/exclusions.ts', { eager: true })
const _exclusionMod = _exclusionModules['../config/exclusions.ts'] as { EXCLUSIONS?: string[][] } | undefined
const EXCLUSIONS: string[][] = _exclusionMod?.EXCLUSIONS ?? []

const GROUP_CAPS = [0.10, 0.20, 0.50]

function getCap(name: string): number {
  for (let i = 0; i < EXCLUSIONS.length; i++) {
    if (EXCLUSIONS[i].includes(name)) return GROUP_CAPS[i]
  }
  return 1
}

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

  const mentions = result.winners
    .map(w => MM_USERNAMES[w.name])
    .filter(Boolean)
    .map(u => `@${u}`)
    .join(' ')

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(mentions && { text: mentions }),
      attachments: [{
        color: '#723F17',
        title: `${dateStr} 오늘의 픽업 당첨자 발표 ☕`,
        text: `${winnerText}\n\n${siteConfig.mmNotification.pickupMessage}`,
        footer: `총 ${totalOrders}잔 주문 · ${result.winners.length}명 당첨`,
      }],
    }),
  })
}

export function drawPickup(orders: Order[]): PickupResult {
  const unique = orders.filter((o, _, arr) =>
    arr.findIndex(x => x.name === o.name && x.class === o.class) === arr.indexOf(o)
  )

  const totalQty = orders.reduce((sum, o) => sum + (o.qty ?? 1), 0)

  const draws: DrawEntry[] = unique.map(o => {
    const count = orders
      .filter(x => x.name === o.name && x.class === o.class)
      .reduce((sum, x) => sum + (x.qty ?? 1), 0)
    const cap = getCap(o.name)
    const randomValue = Math.max(...Array.from({ length: count }, () => Math.random() * cap))
    return { name: o.name, class: o.class, randomValue }
  })

  const sorted = draws.sort((a, b) => b.randomValue - a.randomValue)
  const winnerCount = Math.max(1, Math.ceil(totalQty / 9))
  const topDraws = sorted.slice(0, winnerCount)
  const winners = topDraws.map(d => unique.find(o => o.name === d.name && o.class === d.class)!)

  return {
    winners,
    draws: sorted,
    drawnAt: new Date().toISOString(),
  }
}
