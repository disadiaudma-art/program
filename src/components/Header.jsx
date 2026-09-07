import { useCountdown } from '../hooks/useCountdown'
import { Link } from 'react-router-dom'

export default function Header() {
  const { display, displayMl } = useCountdown()

  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="brand-group">
          <div className="flag-symbol-box" title="Indian Union Muslim League">
            <svg viewBox="0 0 100 100" className="flag-svg">
              <rect width="100" height="100" rx="18" fill="#008751"/>
              <path d="M55,20 A30,30 0 1,0 80,72 A36,36 0 1,1 55,20 Z" fill="#ffffff"/>
              <polygon points="68,36 71,44 80,44 73,49 76,57 68,52 61,57 63,49 57,44 65,44" fill="#ffffff"/>
            </svg>
          </div>
          <div className="brand-titles">
            <span className="brand-sub-badge">
              Malayora Peruma • Ma.Pe. 2026 <span className="ml-sub">മലയോര പെരുമ</span>
            </span>
            <h1 className="brand-main-title">
              IUML Malayora Zone <span className="ml-sub header-ml">മുസ്‌ലിം ലീഗ് മലയോര മേഖല</span>
            </h1>
            <p className="brand-tagline">
              Kodom-Belur | Balal | Kinanoor-Karinthalam{' '}
              <span className="ml-sub">കോടോം ബേളൂർ | ബള്ളാൽ | കിനാനൂർ കരിന്തളം</span>
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="countdown-tag" title="Event Countdown">
            <i className="fa-regular fa-clock"></i>
            <div>
              <span>{display || 'September 26, 2026'}</span>
              <small className="ml-sub countdown-ml">{displayMl || 'സെപ്റ്റംബർ 26, 2026'}</small>
            </div>
          </div>
         
        </div>
      </div>
    </header>
  )
}
