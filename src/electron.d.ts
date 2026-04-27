export {}

declare global {
  interface Window {
    electronAPI?: {
      getSettings: () => Promise<{ name: string; class: string; password: string }>
      saveSettings: (data: { name: string; class: string; password: string }) => Promise<boolean>
      notifyPickup: (winners: Array<{ name: string; class: string }>) => void
      onOpenPickupModal: (cb: () => void) => void
      offOpenPickupModal: (cb: () => void) => void
      openCart: () => void
      openOrders: () => void
      openSettings: () => void
      resizeWindow: (w: number, h: number) => void
    }
  }
}
