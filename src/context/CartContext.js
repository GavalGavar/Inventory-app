'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Load cart from localStorage once, when the app first starts
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) setCart(JSON.parse(saved))
    } catch (e) {
      console.error('Failed to load cart from storage', e)
    }
    setLoaded(true)
  }, [])

  // Save cart to localStorage every time it changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, loaded])

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
