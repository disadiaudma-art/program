export default function SuccessModal({ data, onClose, onSubmitAnother }) {
  if (!data) return null

  return (
    <div className="modal-overlay active" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="modal-box success-modal-box">
        <div className="modal-top">
          <div className="modal-top-heading">
            <i className="fa-solid fa-circle-check text-green"></i>
            <span>Registration Successful!</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-content-scroll success-content-center">
          <div className="success-icon-badge">
            <i className="fa-solid fa-check"></i>
          </div>

          <h3 className="success-title-main">Registration Submitted!</h3>
          <p className="success-title-ml ml-sub">നിങ്ങളുടെ വിവരങ്ങൾ വിജയകരമായി സമർപ്പിച്ചു.</p>

          {data.registrationId && (
            <div className="reg-id-badge">
              <i className="fa-solid fa-id-card"></i>
              Registration ID: <strong>{data.registrationId}</strong>
            </div>
          )}

          <div className="submitted-summary-card">
            <div className="summary-header">
              <i className="fa-solid fa-clipboard-check"></i> Submitted Details Summary
            </div>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="s-label">Full Name (പേര്)</span>
                <span className="s-value">{data.fullName}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Mobile Number (മൊബൈൽ)</span>
                <span className="s-value">
                  <i className="fa-solid fa-phone" style={{fontSize:'0.75rem',color:'#25d366'}}></i> {data.mobileNumber}
                </span>
              </div>
              <div className="summary-item">
                <span className="s-label">Age (വയസ്സ്)</span>
                <span className="s-value">{data.age} Years</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Place (സ്ഥലം)</span>
                <span className="s-value">{data.place}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Panchayat (പഞ്ചായത്ത്)</span>
                <span className="s-value">{data.panchayat}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Unit / Branch (യൂണിറ്റ്)</span>
                <span className="s-value">{data.unit}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Work / Occupation (തൊഴിൽ)</span>
                <span className="s-value">{data.work}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">Qualification (വിദ്യാഭ്യാസം)</span>
                <span className="s-value">{data.qualification}</span>
              </div>
              {data.photoUrl && (
                <div className="summary-item" style={{gridColumn:'span 2'}}>
                  <span className="s-label">Photo (ഫോട്ടോ)</span>
                  <img src={data.photoUrl} alt="Delegate" style={{width:60,height:75,objectFit:'cover',borderRadius:6,marginTop:4,border:'2px solid #008751'}}/>
                </div>
              )}
            </div>
          </div>

          <div className="success-actions-row">
            <button type="button" className="btn btn-primary" onClick={onSubmitAnother}>
              <i className="fa-solid fa-user-plus"></i>
              <span>Submit Another Registration</span>
              <small className="ml-sub">(മറ്റൊരാളെ ചേർക്കുക)</small>
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}
              style={{border:'1px solid #008751',color:'#008751'}}>
              <i className="fa-solid fa-xmark"></i>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
