import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getListings, getCategories, searchListings } from '../api/api'
import ListingCard from '../components/ListingCard'
import './Listings.css'

function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const page = parseInt(searchParams.get('page') || '1')
  const categoryId = searchParams.get('category_id') || ''
  const query = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''

  const [searchInput, setSearchInput] = useState(query)
  const [locationInput, setLocationInput] = useState(location)
  const [selectedCategory, setSelectedCategory] = useState(categoryId)
  const debounceRef = useRef(null)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)

    if (query) {
      searchListings(query)
        .then((data) => {
          setListings(data || [])
          setTotalPages(1)
        })
        .catch(() => setListings([]))
        .finally(() => setLoading(false))
    } else {
      const params = { page, limit: 12 }
      if (categoryId) params.category_id = categoryId
      if (location) params.location = location

      getListings(params)
        .then((data) => {
          setListings(data.data || [])
          setTotalPages(data.total_pages || 1)
        })
        .catch(() => setListings([]))
        .finally(() => setLoading(false))
    }
  }, [page, categoryId, query, location])

  function handleSearchInput(val) {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = {}
      if (val.trim()) params.q = val.trim()
      if (selectedCategory) params.category_id = selectedCategory
      if (locationInput.trim()) params.location = locationInput.trim()
      params.page = '1'
      setSearchParams(params)
    }, 400)
  }

  function handleCategoryChange(val) {
    setSelectedCategory(val)
    const params = {}
    if (searchInput.trim()) params.q = searchInput.trim()
    if (val) params.category_id = val
    if (locationInput.trim()) params.location = locationInput.trim()
    params.page = '1'
    setSearchParams(params)
  }

  function handleLocationInput(val) {
    setLocationInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = {}
      if (searchInput.trim()) params.q = searchInput.trim()
      if (selectedCategory) params.category_id = selectedCategory
      if (val.trim()) params.location = val.trim()
      params.page = '1'
      setSearchParams(params)
    }, 400)
  }

  function clearFilters() {
    setSearchInput('')
    setLocationInput('')
    setSelectedCategory('')
    setSearchParams({})
  }

  function goToPage(p) {
    const params = Object.fromEntries(searchParams.entries())
    params.page = String(p)
    setSearchParams(params)
  }

  const hasFilters = searchInput || selectedCategory || locationInput

  return (
    <div className="listings-page">
      <h1 className="page-title">All Listings</h1>

      <div className="filters">
        <div className="filters-search">
          <svg className="filters-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={locationInput}
          onChange={(e) => handleLocationInput(e.target.value)}
        />
        {hasFilters && (
          <button type="button" className="btn btn-outline btn-sm" onClick={clearFilters}>Clear</button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading listings...</div>
      ) : listings.length > 0 ? (
        <>
          <div className="listings-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No listings found.</p>
          {hasFilters && (
            <button className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Listings
