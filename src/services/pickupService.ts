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
  winner: Order
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

  const winnerDraw = draws.reduce((max, d) => d.randomValue > max.randomValue ? d : max)
  const winner = unique.find(o => o.name === winnerDraw.name && o.class === winnerDraw.class)!

  return {
    winner,
    draws: draws.sort((a, b) => b.randomValue - a.randomValue),
    drawnAt: new Date().toISOString(),
  }
}
