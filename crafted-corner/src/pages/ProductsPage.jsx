import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search, SlidersHorizontal, X, ChevronDown,
  LayoutGrid, LayoutList, PackageOpen
} from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import QuickViewModal from '../components/ui/QuickViewModal'
import Button from '../components/ui/Button'
import { products, categories } from '../data/products'
import styles from './ProductsPage.module.css'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
]

const PRICE_RANGES = [
  { label: 'All prices',    min: 0,   max: Infinity },
  { label: 'Under $30',     min: 0,   max: 30 },
  { label: '$30 – $60',     min: 30,  max: 60 },
  { label: '$60 – $100',    min: 60,  max: 100 },
  { label: '$100 – $150',   min: 100, max: 150 },
  { label: 'Over $150',     min: 150, max: Infinity },
]

function sortProducts(list, sortBy) {
  const arr = [...list]
  switch (sortBy) {
    case 'price-asc':  return arr.sort((a, b) => a.price - b.price)
    case 'price-desc': return arr.sort((a, b) => b.price - a.price)
    case 'rating':     return arr.sort((a, b) => b.rating - a.rating)
    case 'newest':     return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    default:           return arr.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive initial state from URL params
  const [query,         setQuery]         = useState(searchParams.get('q') ?? '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? '')
  const [priceIdx,      setPriceIdx]      = useState(0)
  const [sortBy,        setSortBy]        = useState('featured')
  const [saleOnly,      setSaleOnly]      = useState(searchParams.get('sale') === 'true')
  const [newOnly,       setNewOnly]       = useState(false)
  const [filtersOpen,   setFiltersOpen]   = useState(false)
  const [gridView,      setGridView]      = useState('grid')
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Sync URL → state on param change
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
    setActiveCategory(searchParams.get('category') ?? '')
    setSaleOnly(searchParams.get('sale') === 'true')
  }, [searchParams])

  // Active filter count for badge
  const activeFilterCount = [
    activeCategory !== '',
    priceIdx !== 0,
    saleOnly,
    newOnly,
  ].filter(Boolean).length

  const filtered = useMemo(() => {
    let list = products

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }

    if (activeCategory) {
      list = list.filter(p => p.category === activeCategory)
    }

    if (saleOnly)  list = list.filter(p => p.isSale)
    if (newOnly)   list = list.filter(p => p.isNew)

    const { min, max } = PRICE_RANGES[priceIdx]
    list = list.filter(p => p.price >= min && p.price <= max)

    return sortProducts(list, sortBy)
  }, [query, activeCategory, saleOnly, newOnly, priceIdx, sortBy])

  function clearAll() {
    setQuery('')
    setActiveCategory('')
    setPriceIdx(0)
    setSortBy('featured')
    setSaleOnly(false)
    setNewOnly(false)
    setSearchParams({})
  }

  function handleCategoryClick(catId) {
    const next = activeCategory === catId ? '' : catId
    setActiveCategory(next)
    const params = {}
    if (next) params.category = next
    if (query) params.q = query
    setSearchParams(params)
  }

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    const params = {}
    if (query.trim()) params.q = query.trim()
    if (activeCategory) params.category = activeCategory
    setSearchParams(params)
  }, [query, activeCategory, setSearchParams])

  const currentCat = categories.find(c => c.id === activeCategory)

  return (
    <div className={`page-enter ${styles.page}`}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{currentCat ? currentCat.label : 'All Products'}</span>
          </nav>
          <h1 className={`display-heading ${styles.pageTitle}`}>
            {currentCat ? `${currentCat.icon} ${currentCat.label}` : 'All Products'}
          </h1>
          {currentCat && (
            <p className={styles.pageDesc}>{currentCat.description}</p>
          )}
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>

          {/* ══════════ SIDEBAR FILTERS ══════════ */}
          <aside
            className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}
            aria-label="Product filters"
          >
            {/* Mobile close */}
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Filters</h2>
              <button
                className={styles.sidebarClose}
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category filter */}
            <FilterSection title="Category">
              <button
                className={`${styles.filterPill} ${activeCategory === '' ? styles.filterPillActive : ''}`}
                onClick={() => handleCategoryClick('')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.filterPill} ${activeCategory === cat.id ? styles.filterPillActive : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </FilterSection>

            {/* Price range */}
            <FilterSection title="Price Range">
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={range.label}
                  className={`${styles.filterPill} ${priceIdx === i ? styles.filterPillActive : ''}`}
                  onClick={() => setPriceIdx(i)}
                >
                  {range.label}
                </button>
              ))}
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability">
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={e => setSaleOnly(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>On Sale</span>
              </label>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={newOnly}
                  onChange={e => setNewOnly(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>New Arrivals</span>
              </label>
            </FilterSection>

            {activeFilterCount > 0 && (
              <button className={styles.clearBtn} onClick={clearAll}>
                <X size={14} /> Clear all filters
              </button>
            )}
          </aside>

          {/* Sidebar overlay */}
          {filtersOpen && (
            <div
              className={styles.sidebarOverlay}
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ══════════ MAIN CONTENT ══════════ */}
          <div className={styles.main}>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              {/* Search */}
              <form onSubmit={handleSearch} className={styles.searchForm} role="search">
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className={styles.searchInput}
                  aria-label="Search products"
                />
                {query && (
                  <button
                    type="button"
                    className={styles.searchClear}
                    onClick={() => { setQuery(''); setSearchParams({}) }}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              <div className={styles.toolbarRight}>
                {/* Mobile filter toggle */}
                <button
                  className={styles.filterToggle}
                  onClick={() => setFiltersOpen(true)}
                  aria-label="Open filters"
                  aria-expanded={filtersOpen}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className={styles.filterBadge}>{activeFilterCount}</span>
                  )}
                </button>

                {/* Sort */}
                <div className={styles.sortWrap}>
                  <label htmlFor="sort-select" className="sr-only">Sort by</label>
                  <ChevronDown size={14} className={styles.sortIcon} aria-hidden="true" />
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                    aria-label="Sort products"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Grid / List toggle */}
                <div className={styles.viewToggle} role="group" aria-label="View layout">
                  <button
                    className={`${styles.viewBtn} ${gridView === 'grid' ? styles.viewBtnActive : ''}`}
                    onClick={() => setGridView('grid')}
                    aria-label="Grid view"
                    aria-pressed={gridView === 'grid'}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${gridView === 'list' ? styles.viewBtnActive : ''}`}
                    onClick={() => setGridView('list')}
                    aria-label="List view"
                    aria-pressed={gridView === 'list'}
                  >
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className={styles.activeFilters} aria-label="Active filters">
                {activeCategory && (
                  <FilterChip
                    label={currentCat?.label ?? activeCategory}
                    onRemove={() => handleCategoryClick('')}
                  />
                )}
                {priceIdx !== 0 && (
                  <FilterChip
                    label={PRICE_RANGES[priceIdx].label}
                    onRemove={() => setPriceIdx(0)}
                  />
                )}
                {saleOnly && (
                  <FilterChip label="On Sale" onRemove={() => setSaleOnly(false)} />
                )}
                {newOnly && (
                  <FilterChip label="New Arrivals" onRemove={() => setNewOnly(false)} />
                )}
                <button className={styles.clearAllChip} onClick={clearAll}>Clear all</button>
              </div>
            )}

            {/* Result count */}
            <p className={styles.resultCount} aria-live="polite" aria-atomic="true">
              {filtered.length === 0
                ? 'No products found'
                : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
            </p>

            {/* Grid / List */}
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div className={gridView === 'grid' ? styles.productsGrid : styles.productsList}>
                {filtered.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

/* ── Sub-components ── */

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className={styles.filterSection}>
      <button
        className={styles.filterSectionTitle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={16}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>
      {open && <div className={styles.filterSectionBody}>{children}</div>}
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className={styles.filterChip}>
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={12} />
      </button>
    </span>
  )
}

function EmptyState({ onClear }) {
  return (
    <div className={styles.emptyState} role="status">
      <PackageOpen size={56} className={styles.emptyIcon} aria-hidden="true" />
      <h3 className={styles.emptyTitle}>No products found</h3>
      <p className={styles.emptyText}>
        Try adjusting your filters or search term — there are plenty of beautiful things waiting.
      </p>
      <Button variant="primary" onClick={onClear}>Clear all filters</Button>
    </div>
  )
}
