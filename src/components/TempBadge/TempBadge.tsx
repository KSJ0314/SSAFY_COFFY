import styled, { css } from 'styled-components'
import type { MenuTemp } from '../../constants/coffeeMenu'
import type { Props } from './types'

const Badge = styled.span<{ $temp: string; $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: 4px;
  letter-spacing: 0.5px;
  flex-shrink: 0;

  ${({ $size }) =>
    $size === 'md'
      ? css`font-size: 0.75rem; padding: 2px 7px;`
      : css`font-size: 0.65rem; padding: 1px 5px;`}

  ${({ $temp, theme }) =>
    $temp === 'ICE'
      ? css`
          background: ${theme.colors.iceBg};
          color: ${theme.colors.iceText};
          border: 1px solid ${theme.colors.iceBorder};
        `
      : css`
          background: ${theme.colors.hotBg};
          color: ${theme.colors.hotText};
          border: 1px solid ${theme.colors.hotBorder};
        `}
`

export default function TempBadge({ temp, size = 'md' }: Props) {
  return (
    <Badge $temp={temp} $size={size}>
      {temp}
    </Badge>
  )
}

export function parseMenuName(fullName: string): { temp: MenuTemp | null; name: string } {
  if (fullName.startsWith('ICE ')) return { temp: 'ICE', name: fullName.slice(4) }
  if (fullName.startsWith('HOT ')) return { temp: 'HOT', name: fullName.slice(4) }
  return { temp: null, name: fullName }
}
