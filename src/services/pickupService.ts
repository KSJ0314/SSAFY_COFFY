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
