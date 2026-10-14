import React, { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const initialState = {
  items: [],      // { product, quantity }
  promoCode: '',
  promoDiscount: 0,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.product.id === action.product.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: action.quantity ?? 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.id) }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.product.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    }
    case 'APPLY_PROMO': {
      const validCodes = { 'CRAFTED10': 0.10, 'HANDMADE20': 0.20, 'WELCOME15': 0.15 }
      const discount = validCodes[action.code.toUpperCase()] ?? null
      if (discount === null) return { ...state, promoCode: action.code, promoDiscount: 0, promoError: 'Invalid promo code' }
      return { ...state, promoCode: action.code.toUpperCase(), promoDiscount: discount, promoError: null }
    }
    case 'CLEAR_PROMO':
      return { ...state, promoCode: '', promoDiscount: 0, promoError: null }

    case 'CLEAR_CART':
      return { ...initialState }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem     = useCallback((product, quantity = 1) => dispatch({ type: 'ADD_ITEM', product, quantity }), [])
  const removeItem  = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const updateQty   = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }), [])
  const applyPromo  = useCallback((code) => dispatch({ type: 'APPLY_PROMO', code }), [])
  const clearPromo  = useCallback(() => dispatch({ type: 'CLEAR_PROMO' }), [])
  const clearCart   = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const itemCount   = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal    = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const discount    = subtotal * state.promoDiscount
  const shipping    = subtotal === 0 ? 0 : subtotal >= 100 ? 0 : 7.95
  const total       = subtotal - discount + shipping

  return (
    <CartContext.Provider value={{
      items: state.items,
      itemCount,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: state.promoCode,
      promoDiscount: state.promoDiscount,
      promoError: state.promoError,
      addItem,
      removeItem,
      updateQty,
      applyPromo,
      clearPromo,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
