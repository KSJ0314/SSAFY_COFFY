import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  title: string
  icon?: string
  backPath: string
  actions?: ReactNode
  children: ReactNode
  tableMinHeight?: number
}

export default function PageLayout({ title, icon = '☕', backPath, actions, children, tableMinHeight }: Props) {
  const navigate = useNavigate()
  return (
    <div className="list-page-bg">
      <div className="list-page">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate(backPath)}>← 돌아가기</button>
          <div className="list-title-area">
            <span className="logo">{icon}</span>
            <h1>{title}</h1>
          </div>
          <div className="list-actions">
            {actions}
          </div>
        </div>
        <div className="list-page-body" style={tableMinHeight ? { minHeight: `${tableMinHeight}px` } : undefined}>
          {children}
        </div>
      </div>
    </div>
  )
}
