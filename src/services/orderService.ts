import { collection, addDoc, deleteDoc, doc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import type { Order } from '../context/OrderContext'

export function getTodayKST(): string {
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
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order))
    callback(data)
  })
}

export async function saveOrder(order: Order): Promise<void> {
  const today = getTodayKST()
  const { id: _, ...orderData } = order
  await addDoc(collection(db, 'orders'), {
    ...orderData,
    date: today,
    createdAt: serverTimestamp(),
  })
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, 'orders', id))
}
