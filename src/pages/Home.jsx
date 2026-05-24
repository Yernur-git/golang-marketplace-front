import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecentListings, getCategories } from '../api/api'
import ListingCard from '../components/ListingCard'
import CategoryIcon from '../components/CategoryIcon'
import './Home.css'

function Home() {
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getRecentListings(), getCategories()])
      .then(([listingsData, categoriesData]) => {
        setListings(listingsData || [])
        setCategories(categoriesData || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/listings?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-line hero-line-1"></div>
          <div className="hero-line hero-line-2"></div>
          <div className="hero-line hero-line-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">NurLens Marketplace</div>
          <h1 className="hero-title">
            Find Your Next<br />
            <span className="hero-title-accent">Perfect Lens</span>
          </h1>
          <p className="hero-subtitle">
            Buy and sell professional photo & video gear<br className="hide-mobile" />
            across Kazakhstan
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-inner">
              <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search cameras, lenses, tripods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">Search</button>
            </div>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{listings.length || '—'}</span>
              <span className="hero-stat-label">Listings</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">{categories.length || '—'}</span>
              <span className="hero-stat-label">Categories</span>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Categories</h2>
          </div>
          <div className="cat-grid">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                className="cat-card"
                onClick={() => navigate(`/listings?category_id=${cat.id}`)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="cat-icon">
                  <CategoryIcon name={cat.name} size={28} />
                </span>
                <span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Listings</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/listings')}>
            View all →
          </button>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : listings.length > 0 ? (
          <div className="listings-grid">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No listings yet. Be the first to sell your gear.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
