export default function HeroSection({ onOpenPoster }) {
  return (
    <section className="poster-hero">
      <div className="hero-watercolor-bg"></div>
      <div className="container hero-layout">

        {/* Left: Visual Emblem */}
        <div className="hero-poster-crest-column">
          <div className="poster-crest-wrapper">

            {/* Waving IUML Flag */}
            <div className="waving-flag-holder">
              <svg className="waving-flag-svg" viewBox="0 0 170 120">
                <defs>
                  <linearGradient id="flagPoleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b0bec5"/>
                    <stop offset="50%" stopColor="#ffffff"/>
                    <stop offset="100%" stopColor="#78909c"/>
                  </linearGradient>
                </defs>
                <line x1="22" y1="5" x2="22" y2="115" stroke="url(#flagPoleGrad)" strokeWidth="5" strokeLinecap="round"/>
                <circle cx="22" cy="5" r="5" fill="#eceff1" stroke="#90a4ae" strokeWidth="1.5"/>
                <path d="M24,12 Q 65,2 100,16 T 165,13 L 165,76 Q 125,62 85,76 T 24,70 Z" fill="#008751"/>
                <path d="M102,28 A16,16 0 1,0 120,58 A20,20 0 1,1 102,28 Z" fill="#ffffff"/>
                <polygon points="120,36 122,41 128,41 123,44 125,50 120,46 115,50 117,44 112,41 118,41" fill="#ffffff"/>
              </svg>
            </div>

            {/* Cloud Badge */}
            <div className="poster-cloud-badge">
              <div className="badge-accent-stars">
                <i className="fa-solid fa-asterisk"></i>
                <i className="fa-solid fa-asterisk"></i>
              </div>
              <div className="cloud-inner-box">
                <div className="cloud-header-motif"><i className="fa-solid fa-heart"></i></div>
                <h2 className="cloud-main-uve">U.Pe. <small className="ml-sub">ഉ.പെ.</small></h2>
                <div className="cloud-year-2026">2026</div>
                <div className="cloud-sub-peruma">Malayora Peruma <small className="ml-sub">മലയോര പെരുമ</small></div>
              </div>
            </div>

            {/* Two-Tone Banner Pill */}
            <div className="poster-two-tone-pill">
              <div className="pill-top-blue"><span>IUML Malayora Zone</span></div>
              <div className="pill-bottom-split">
                <span className="pill-green-part">Family</span>
                <span className="pill-yellow-part">Convention 2026</span>
              </div>
            </div>

            {/* Date & Venue */}
            <div className="poster-event-details">
              <div className="event-detail-item">
                <div className="edi-icon"><i className="fa-regular fa-calendar-days"></i></div>
                <div className="edi-info">
                  <strong>Saturday, 26 September 2026</strong>
                  <span className="ml-sub">2026 സെപ്റ്റംബർ 26 ശനി</span>
                </div>
              </div>
              <div className="event-detail-item">
                <div className="edi-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div className="edi-info">
                  <strong>Parappa Royal Palace Auditorium</strong>
                  <span className="ml-sub">പരപ്പ റോയൽ പാലസ് ഓഡിറ്റോറിയം</span>
                </div>
              </div>
            </div>

            {/* Panchayats Ribbon */}
            <div className="poster-panchayats-ribbon">
              <i className="fa-solid fa-mountain-sun"></i>
              <span>IUML Kodom-Belur | Balal | Kinanoor-Karinthalam <span className="ml-sub">പഞ്ചായത്ത്</span></span>
            </div>

            {/* View Poster Button */}
            <button type="button" className="btn-preview-original-poster" onClick={onOpenPoster}>
              <i className="fa-regular fa-image"></i>
              <span>View Official Poster <span className="ml-sub">(പോസ്റ്റർ കാണുക)</span></span>
            </button>

          </div>
        </div>

        {/* Right: Intro */}
        <div className="hero-intro-column">
          <div className="portal-badge-pill">
            <i className="fa-solid fa-file-signature"></i>
            <span>Official Delegate Registration Portal</span>
            <span className="ml-sub">ഔദ്യോഗിക രജിസ്ട്രേഷൻ ഫോം</span>
          </div>

          <h2 className="intro-heading">
            Welcome to <span className="highlight-yellow">Malayora Peruma 2026</span> Family Convention
          </h2>
          <p className="intro-heading-ml ml-sub">മലയോര പെരുമ കുടുംബ സംഗമത്തിലേക്ക് സ്വാഗതം!</p>

          <div className="intro-lead-card">
            <p className="intro-lead-en">
              Register your details for the historic family gathering of IUML members across Kodom-Belur, Balal, and Kinanoor-Karinthalam Panchayats.
            </p>
            <p className="intro-lead-ml ml-sub">
              കോടോം ബേളൂർ, ബള്ളാൽ, കിനാനൂർ കരിന്തളം പഞ്ചായത്തുകളിലെ മുസ്‌ലിം ലീഗ് കുടുംബാംഗങ്ങളുടെ ചരിത്ര സംഗമത്തിലേക്ക് വിവരങ്ങൾ രേഖപ്പെടുത്തുക.
            </p>
          </div>

          <a href="#registrationCard" className="btn btn-hero-action">
            <i className="fa-solid fa-file-pen"></i>
            <span>Fill Registration Form</span>
            <small className="ml-sub">രജിസ്ട്രേഷൻ ഫോം</small>
            <i className="fa-solid fa-arrow-down"></i>
          </a>
        </div>
      </div>

      <div className="hill-scenery-curve">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,100 480,20 800,70 C1080,110 1280,40 1440,80 L1440,120 L0,120 Z" fill="#e4f3e7"/>
          <path d="M0,80 C360,110 600,40 960,90 C1200,120 1360,70 1440,95 L1440,120 L0,120 Z" fill="#f4faf5"/>
        </svg>
      </div>
    </section>
  )
}
