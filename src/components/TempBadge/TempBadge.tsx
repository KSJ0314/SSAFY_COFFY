import type { MenuTemp } from '../../constants/coffeeMenu'
import type { Props } from './types'

export default function TempBadge({ temp, size = 'md' }: Props) {
  return (
    <span className={`temp-badge temp-badge-${temp.toLowerCase()} temp-badge-${size}`}>
      {temp}
    </span>
  )
}

// 메뉴 전체 이름(예: "ICE 아메리카노")에서 뱃지+이름 파싱
export function parseMenuName(fullName: string): { temp: MenuTemp | null; name: string } {
  if (fullName.startsWith('ICE ')) return { temp: 'ICE', name: fullName.slice(4) }
  if (fullName.startsWith('HOT ')) return { temp: 'HOT', name: fullName.slice(4) }
  return { temp: null, name: fullName }
}
