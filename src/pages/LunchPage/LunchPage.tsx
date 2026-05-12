import LunchMenuModal from '../../components/LunchMenuModal'

export default function LunchPage() {
  return <LunchMenuModal onClose={() => window.close()} standalone />
}
