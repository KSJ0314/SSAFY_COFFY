import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp, getDocs
} from 'firebase/firestore'
import { db } from '../firebase'

export type Inquiry = {
  id?: string
  title: string
  content: string
  password: string
  name: string | null
  class: string | null
  createdAt?: ReturnType<typeof serverTimestamp>
}

export type Comment = {
  id?: string
  content: string
  password: string
  isAdmin?: boolean
  createdAt?: ReturnType<typeof serverTimestamp>
}

export function subscribeInquiries(callback: (list: Inquiry[]) => void): () => void {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry))),
    _err => callback([])
  )
}

export async function saveInquiry(data: Omit<Inquiry, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'inquiries'), { ...data, createdAt: serverTimestamp() })
}

export async function updateInquiry(id: string, data: { title: string; content: string }): Promise<void> {
  await updateDoc(doc(db, 'inquiries', id), data)
}

export async function deleteInquiry(id: string): Promise<void> {
  const commentsSnap = await getDocs(collection(db, 'inquiries', id, 'comments'))
  await Promise.all(commentsSnap.docs.map(d => deleteDoc(d.ref)))
  await deleteDoc(doc(db, 'inquiries', id))
}

export function subscribeComments(inquiryId: string, callback: (list: Comment[]) => void): () => void {
  const q = query(collection(db, 'inquiries', inquiryId, 'comments'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)))
  })
}

export async function saveComment(inquiryId: string, data: { content: string; password: string; isAdmin?: boolean }): Promise<void> {
  await addDoc(collection(db, 'inquiries', inquiryId, 'comments'), { ...data, createdAt: serverTimestamp() })
}

export async function deleteComment(inquiryId: string, commentId: string): Promise<void> {
  await deleteDoc(doc(db, 'inquiries', inquiryId, 'comments', commentId))
}
