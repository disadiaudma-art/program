import posterCardImg from '../assets/poster-top-half.jpg'

export default function HeroSection({ onOpenPoster }) {
  return (
    <section className="poster-hero">
      <div className="container hero-layout-single-card">
        <div 
          className="hero-poster-card" 
          onClick={onOpenPoster}
          title="IUML Malayora Peruma 2026 • Ma.Pe (Click to view full poster)"
        >
          <img 
            src={posterCardImg} 
            alt="IUML Malayora Zone Kudumba Sangamam - Ma.Pe 2026" 
            className="hero-poster-image"
          />
        </div>
      </div>
    </section>
  )
}
