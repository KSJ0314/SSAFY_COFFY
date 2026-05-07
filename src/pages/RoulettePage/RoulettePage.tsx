import RouletteModal from '../../components/RouletteModal'

export default function RoulettePage() {
  return (
    <RouletteModal
      open={true}
      standalone={true}
      onClose={() => window.close()}
      onWinner={name => localStorage.setItem('coffy_name', name)}
    />
  )
}
