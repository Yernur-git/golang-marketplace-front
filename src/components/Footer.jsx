import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-mark">N</span>
            <span className="footer-name">NurLens</span>
          </div>
          <p className="footer-desc">Kazakhstan's marketplace for photo & video gear.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/listings">Browse</Link>
          <Link to="/register">Join</Link>
        </div>
        <div className="footer-copy">
          <span>&copy; 2025 NurLens</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
