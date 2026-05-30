import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  name: string
  price: number
  qty: number
  image: string
}

interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.product_id === item.product_id)
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.product_id === item.product_id
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== id) })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === id ? { ...i, qty } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: 'vooh-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
