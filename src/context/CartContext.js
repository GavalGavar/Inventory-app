'use client'

import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        if (existing.qty >= item.quantity) {
          alert('No more stock available for this item.')
          return prev
        }
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function updateQty(id, newQty) {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id)
      if (!item) return prev

      if (newQty < 1) {
        return prev.filter((i) => i.id !== id)
      }

      if (newQty > item.quantity) {
        alert('No more stock available for this item.')
        return prev
      }

      return prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
    })
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, updateQty }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
