import React, { createContext, useContext, useState, useCallback } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(new Set())

  const toggle = useCallback((id) => {
    setIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const has   = useCallback((id) => ids.has(id), [ids])
  const count = ids.size

  return (
    <WishlistContext.Provider value={{ ids, toggle, has, count }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
