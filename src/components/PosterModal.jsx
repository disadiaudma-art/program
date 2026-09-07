import posterImg from '../assets/poster.jpg'

export default function PosterModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="modal-overlay active" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="modal-box poster-modal-box">
        <div className="modal-top" style={{background:'#0d1a12',borderBottom:'1px solid #1a3022'}}>
          <div className="modal-top-heading" style={{color:'#fff'}}>
            <i className="fa-regular fa-image text-green"></i>
            <span>Official Convention Poster <small className="ml-sub">(ഔദ്യോഗിക പോസ്റ്റർ)</small></span>
          </div>
          <button type="button" className="modal-close" onClick={onClose} style={{color:'#aaa'}}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="poster-modal-view">
          <img src={posterImg} alt="U.Ve 2026 Malayora Peruma Official Poster" className="full-view-poster"/>
        </div>
      </div>
    </div>
  )
}
