import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import type { Order } from '../context/OrderContext'

export function subscribeTodayOrders(callback: (orders: Order[]) => void): () => void {
  const today = new Date().toISOString().slice(0, 10)
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
  const today = new Date().toISOString().slice(0, 10)
  await addDoc(collection(db, 'orders'), {
    ...order,
    date: today,
    createdAt: serverTimestamp(),
  })
}
