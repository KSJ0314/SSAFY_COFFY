import styled from 'styled-components'

const Img = styled.img<{ $size?: number }>`
  width: ${({ $size }) => ($size ? `${$size}px` : '1em')};
  height: ${({ $size }) => ($size ? `${$size}px` : '1em')};
  display: inline-block;
`

interface Props {
  size?: number
  className?: string
}

export default function CoffeeIcon({ size, className }: Props) {
  return (
    <Img
      src={`${import.meta.env.BASE_URL}favicon.ico`}
      alt=""
      $size={size}
      className={className}
    />
  )
}
