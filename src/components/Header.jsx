import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isLoggedIn, removeToken } from '../api/api'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = isLoggedIn()

  function handleLogout() {
    removeToken()
    navigate('/')
    window.location.reload()
  }

  function isActive(path) {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-mark">N</div>
          <div className="logo-wordmark">
            <span className="logo-name">NurLens</span>
            <span className="logo-tagline">Photo & Video</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/listings" className={isActive('/listings')}>Browse</Link>
          {loggedIn && <Link to="/listings/new" className={isActive('/listings/new')}>Sell</Link>}
        </nav>

        <div className="header-actions">
          {loggedIn ? (
            <>
              <Link to="/profile" className={`btn btn-ghost btn-sm ${isActive('/profile')}`}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-accent btn-sm">Join</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
