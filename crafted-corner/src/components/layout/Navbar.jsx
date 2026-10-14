import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, Search, Menu, X, ChevronDown, User
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { categories } from '../../data/products'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { itemCount }     = useCart()
  const { count: wlCount } = useWishlist()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery]         = useState('')
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [navigate])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} role="banner">
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="Crafted Corner home">
            <span className={styles.logoMark}>CC</span>
            <span className={styles.logoText}>Awate's Art Gallary</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
              Home
            </NavLink>
            <div className={styles.dropdown}>
              <button className={styles.navLink}>
                Shop <ChevronDown size={14} />
              </button>
              <div className={styles.dropdownMenu} role="menu">
                <Link to="/products" className={styles.dropdownItem} role="menuitem">All Products</Link>
                <div className={styles.dropdownDivider} />
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className={styles.dropdownItem}
                    role="menuitem"
                  >
                    <span className={styles.catIcon}>{cat.icon}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/products?sale=true" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Sale
            </NavLink>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search toggle */}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Toggle search"
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Account */}
            <button className={styles.iconBtn} aria-label="Account">
              <User size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className={styles.iconBtn} aria-label={`Wishlist, ${wlCount} items`}>
              <Heart size={20} />
              {wlCount > 0 && <span className={styles.badge}>{wlCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className={styles.iconBtn} aria-label={`Cart, ${itemCount} items`}>
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
            </Link>

            {/* Mobile hamburger */}
            <button
              className={`${styles.iconBtn} ${styles.hamburger}`}
              onClick={() => setMenuOpen(s => !s)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className={styles.searchBar}>
            <form onSubmit={handleSearch} className={`container ${styles.searchForm}`} role="search">
              <Search size={18} className={styles.searchIcon} />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search handmade products…"
                className={styles.searchInput}
                aria-label="Search products"
              />
              <button type="submit" className={styles.searchSubmit}>Search</button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer} role="dialog" aria-label="Mobile menu" aria-modal="true">
          <div className={styles.drawerOverlay} onClick={() => setMenuOpen(false)} />
          <nav className={styles.drawerContent}>
            <div className={styles.drawerHeader}>
              <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
                <span className={styles.logoMark}>CC</span>
                <span className={styles.logoText}>Crafted Corner</span>
              </Link>
              <button className={styles.iconBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            <div className={styles.drawerLinks}>
              <Link to="/" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/products" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>All Products</Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className={styles.drawerLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{cat.icon}</span> {cat.label}
                </Link>
              ))}
              <Link to="/products?sale=true" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>Sale</Link>
              <Link to="/cart" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
                Cart {itemCount > 0 && <span className={styles.drawerBadge}>{itemCount}</span>}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
