import type { PickupResult } from '../../services/pickupService'

export type Props = {
  result: PickupResult
  onClose: () => void
}
