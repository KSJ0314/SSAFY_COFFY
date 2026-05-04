import type { ReactNode } from 'react'

export type Props = {
  title: string
  icon?: string
  backPath: string
  actions?: ReactNode
  children: ReactNode
  tableMinHeight?: number
}
