import type { ReactNode } from 'react'

export type Props = {
  title: string
  subTitle?: string
  icon?: ReactNode
  backPath: string
  actions?: ReactNode
  children: ReactNode
  tableMinHeight?: number
}
