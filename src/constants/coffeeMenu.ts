export type MenuTemp = 'ICE' | 'HOT'

export type MenuItem = {
  name: string
  temp: MenuTemp
  price: number
}

export type MenuItemType = {
  temp: string
  price: number
  image: string
  kcal: number | null
}

export type MenuDataItem = {
  name: string
  types: MenuItemType[]
}

export type MenuCategory = {
  category: string
  items: MenuDataItem[]
}

export type OptionItem = {
  name: string
  price: number
}

export const MENU_ITEMS: MenuItem[] = [
  { name: '아메리카노', temp: 'HOT', price: 1700 },
  { name: '아메리카노', temp: 'ICE', price: 2000 },
  { name: '디카페인 아메리카노', temp: 'ICE', price: 3000 },
  { name: '카페라떼', temp: 'ICE', price: 2900 },
  { name: '바닐라 라떼', temp: 'ICE', price: 3400 },
  { name: '복숭아 아이스티', temp: 'ICE', price: 3000 },
  { name: '제로 복숭아 아이스티', temp: 'ICE', price: 3000 },
  { name: '자몽에이드', temp: 'ICE', price: 3500 },
  { name: '라이트 바닐라 아몬드라떼', temp: 'ICE', price: 3900 },
]

export const OPTION_ITEMS: OptionItem[] = [
  { name: '샷 연하게', price: 0 },
  { name: '샷 추가', price: 600 },
  { name: '2샷 추가', price: 1200 },
  { name: '디카페인 샷 추가', price: 1000 },
  { name: '디카페인 2샷 추가', price: 2000 },
  { name: '오트밀크 변경', price: 500 },
]

export const CUSTOM_PRICE_OPTIONS: number[] = [
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
]
