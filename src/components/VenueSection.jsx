export default function VenueSection() {
  return (
    <section className="venue-guide-section">
      <div className="container">
        <div className="section-center-head">
          <div className="venue-pill-badge">
            <i className="fa-solid fa-map-pin"></i> Venue &amp; Route Details <small className="ml-sub">(വേദിയും വഴിയും)</small>
          </div>
          <h2>Royal Palace Auditorium, Parappa</h2>
          <p>
            Sunday, September 27, 2026
            <span className="ml-sub d-block">2026 സെപ്റ്റംബർ 27 ഞായറാഴ്ച </span>
          </p>
        </div>

        <div className="venue-cards-grid">
          <div className="venue-card">
            <div className="vc-icon"><i className="fa-solid fa-building-columns"></i></div>
            <h3>Auditorium Address <small className="ml-sub">(ഓഡിറ്റോറിയം വിലാസം)</small></h3>
            <p className="vc-address">
              <strong>Royal Palace Auditorium</strong><br/>
              Parappa Town, Vellarikundu Taluk, Kasaragod District, Kerala - 671533
            </p>
            <div className="distances-wrap">
              <span><i className="fa-solid fa-route"></i> Kanhangad: 24 km</span>
              <span><i className="fa-solid fa-route"></i> Vellarikundu: 7 km</span>
              <span><i className="fa-solid fa-route"></i> Nileshwar: 28 km</span>
            </div>
            <a href="https://maps.google.com/?q=Royal+Palace+Auditorium+Parappa"
               target="_blank" rel="noreferrer"
               className="btn btn-secondary btn-sm map-btn">
              <i className="fa-solid fa-location-arrow"></i> Open in Google Maps <small className="ml-sub">(ഗൂഗിൾ മാപ്പ്)</small>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
