import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import type { Order } from '../context/OrderContext'

function getTodayKST(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

export function subscribeTodayOrders(callback: (orders: Order[]) => void): () => void {
  const today = getTodayKST()
  const q = query(
    collection(db, 'orders'),
    where('date', '==', today),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, snapshot => {
    const data = snapshot.docs.map(doc => doc.data() as Order)
    callback(data)
  })
}

export async function saveOrder(order: Order): Promise<void> {
  const today = getTodayKST()
  await addDoc(collection(db, 'orders'), {
    ...order,
    date: today,
    createdAt: serverTimestamp(),
  })
}
