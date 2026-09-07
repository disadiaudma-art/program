import { useState, useRef } from 'react'
import { submitDelegate, uploadPhoto } from '../api/api'


const PANCHAYATS = [
  { value: 'കോടോംബേളൂർ', label: 'കോടോംബേളൂർ (Kodom-Belur)' },
  { value: 'കിനാനൂർ കരിന്തളം', label: 'കിനാനൂർ കരിന്തളം (Kinanoor-Karinthalam)' },
  { value: 'ബളാൽ', label: 'ബളാൽ (Balal)' },
]

const BRANCHES = [
  { value: 'കാലിച്ചാനടുക്കം', label: '1. കാലിച്ചാനടുക്കം (Kalichanadukkam)' },
  { value: 'നമ്പ്യാർകൊച്ചി', label: '2. നമ്പ്യാർകൊച്ചി (Nambyarkochi)' },
  { value: 'എടത്തോട്', label: '3. എടത്തോട് (Edathode)' },
  { value: 'പരപ്പ', label: '4. പരപ്പ (Parappa)' },
  { value: 'കമ്മാടം', label: '5. കമ്മാടം (Kammadam)' },
  { value: 'ഒടയഞ്ചാൽ', label: '6. ഒടയഞ്ചാൽ (Odayanchal)' },
  { value: 'കല്ലഞ്ചിറ', label: '7. കല്ലഞ്ചിറ (Kallanchira)' },
]

const initForm = { fullName:'', age:'', mobileNumber:'', place:'', panchayat:'', unit:'', customUnit:'', work:'', qualification:'' }
const initErrors = { fullName:'', age:'', mobileNumber:'', place:'', panchayat:'', unit:'', work:'', qualification:'' }

export default function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState(initForm)
  const [errors, setErrors] = useState(initErrors)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef()
  const cameraInputRef = useRef()

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(name, value) {
    switch (name) {
      case 'fullName': return value.trim().length >= 2 ? '' : 'Please enter full name (ദയവായി പേര് രേഖപ്പെടുത്തുക)'
      case 'age': return Number(value) >= 5 && Number(value) <= 115 ? '' : 'Enter valid age 5–115 (ശരിയായ വയസ്സ് നൽകുക)'
      case 'mobileNumber': return /^[6-9]\d{9}$/.test(value.replace(/\D/g,'')) ? '' : 'Enter valid 10-digit number (10 അക്ക മൊബൈൽ നമ്പർ നൽകുക)'
      case 'place': return value.trim().length >= 2 ? '' : 'Please enter your place (ദയവായി സ്ഥലം രേഖപ്പെടുത്തുക)'
      case 'panchayat': return value.trim().length >= 2 ? '' : 'Please enter panchayat (ദയവായി പഞ്ചായത്ത് രേഖപ്പെടുത്തുക)'
      case 'unit': return value.trim().length >= 2 ? '' : 'Please enter your unit (യൂണിറ്റ് രേഖപ്പെടുത്തുക)'
      case 'work': return value.trim().length >= 2 ? '' : 'Please enter work / occupation (തൊഴിൽ രേഖപ്പെടുത്തുക)'
      case 'qualification': return value.trim().length >= 2 ? '' : 'Please enter qualification (വിദ്യാഭ്യാസ യോഗ്യത രേഖപ്പെടുത്തുക)'
      default: return ''
    }
  }

  function handleChange(e) {
    let { name, value } = e.target
    if (name === 'mobileNumber') value = value.replace(/\D/g, '').slice(0, 10)
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) setErrors(er => ({ ...er, [name]: validate(name, value) }))
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(er => ({ ...er, [name]: validate(name, value) }))
  }

  function validateAll() {
    const newErrors = {}
    let valid = true
    Object.keys(form).forEach(k => {
      const err = validate(k, form[k])
      newErrors[k] = err
      if (err) valid = false
    })

    if (!photo) {
      setPhotoError('Please upload a delegate photo (ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക നിർബന്ധമാണ്)')
      valid = false
    } else {
      setPhotoError('')
    }

    setErrors(newErrors)
    setTouched(Object.keys(form).reduce((a,k)=>({...a,[k]:true}),{}))
    return valid
  }

  // ── Photo Handling ──────────────────────────────────────────────────────────
  function handlePhotoFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPEG, PNG, WebP) / ശരിയായ ചിത്രം തിരഞ്ഞെടുക്കുക')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo size must be less than 5MB / ഫോട്ടോ 5MB-ൽ താഴെയായിരിക്കണം')
      return
    }
    setPhotoError('')
    setPhotoPreview(URL.createObjectURL(file))
    setPhoto(file)
  }

  function handleFileInput(e) { handlePhotoFile(e.target.files[0]) }
  function handleDrop(e) {
    e.preventDefault(); setDragOver(false)
    handlePhotoFile(e.dataTransfer.files[0])
  }
  function clearPhoto() {
    setPhoto(null)
    setPhotoPreview(null)
    setPhotoError('Please upload a delegate photo (ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക നിർബന്ധമാണ്)')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateAll()) {
      const firstErr = document.querySelector('.form-group.has-error, .photo-upload-section.has-error')
      if (firstErr) firstErr.scrollIntoView({ behavior:'smooth', block:'center' })
      return
    }

    setSubmitting(true)
    try {
      let photoUrl = null, photoPublicId = null

      if (!photo) {
        setPhotoError('Please upload a delegate photo (ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക നിർബന്ധമാണ്)')
        setSubmitting(false)
        return
      }

      setPhotoUploading(true)
      try {
        const res = await uploadPhoto(photo)
        photoUrl = res.data.url
        photoPublicId = res.data.publicId
      } catch (uploadErr) {
        setPhotoUploading(false)
        setSubmitting(false)
        setPhotoError('Photo upload failed. Please try again. (ഫോട്ടോ അപ്‌ലോഡ് പരാജയപ്പെട്ടു)')
        const errorMsg = uploadErr.response?.data?.message || uploadErr.message || 'Photo upload failed'
        alert(`Failed to upload photo: ${errorMsg}. Please try again.`)
        return
      }
      setPhotoUploading(false)

      const panchayatVal = form.panchayat === 'Other' ? (form.customPanchayat?.trim() || 'Other') : form.panchayat
      const unitVal = form.unit === 'Other' ? (form.customUnit?.trim() || 'Other') : form.unit

      const payload = {
        ...form,
        panchayat: panchayatVal,
        unit: unitVal,
        age: parseInt(form.age, 10),
        photoUrl,
        photoPublicId,
      }
      delete payload.customPanchayat
      delete payload.customUnit

      const res = await submitDelegate(payload)
      onSuccess(res.data.data)
      setForm(initForm)
      setErrors(initErrors)
      setTouched({})
      setPhoto(null)
      setPhotoPreview(null)
      setPhotoError('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (cameraInputRef.current) cameraInputRef.current.value = ''
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Submission failed. Please try again.'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  function fg(name) {
    return `form-group${touched[name] && errors[name] ? ' has-error' : touched[name] && !errors[name] ? ' has-success' : ''}`
  }

  return (
    <main className="main-body container" id="registrationCard">
      <div className="form-container-card">
        {/* Card Header */}
        <div className="form-card-header">
          <div className="form-seal-badge">
            <i className="fa-solid fa-file-signature"></i>
            <span>Delegate Registration 2026 <span className="ml-sub">പ്രതിനിധി രജിസ്ട്രേഷൻ</span></span>
          </div>
          <h2 className="form-header-title">
            Delegate Registration Details
            <span className="form-title-ml ml-sub">കുടുംബ സംഗമം ഡെലിഗേറ്റ് വിവരങ്ങൾ</span>
          </h2>
          <p className="form-header-subtitle">
            Please fill in all required details and upload your photo to complete your registration.
            <span className="ml-sub d-block">വിവരങ്ങൾ കൃത്യമായി പൂരിപ്പിച്ച് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്തു സമർപ്പിക്കുക.</span>
          </p>
        </div>

        <form id="delegateForm" onSubmit={handleSubmit} noValidate autoComplete="off">

          {/* SECTION 1: Personal & Contact */}
          <div className="form-section">
            <div className="section-badge-bar">
              <span className="step-circle">1</span>
              <div className="section-title-wrap">
                <h3 className="section-title-en">Personal &amp; Contact Information</h3>
                <small className="section-sub-ml ml-sub">വ്യക്തിഗത &amp; സമ്പർക്ക വിവരങ്ങൾ (Name, Age, Mobile Number)</small>
              </div>
            </div>
            <div className="form-grid-3">
              {/* Full Name */}
              <div className={`${fg('fullName')} span-2`}>
                <label htmlFor="fullName">
                  <span className="label-en">1. Full Name</span>
                  <span className="label-ml ml-sub">പേര്</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-regular fa-user input-icon"></i>
                  <input type="text" id="fullName" name="fullName" value={form.fullName}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. P. K. Abdulla (പി. കെ. അബ്ദുല്ല)" />
                </div>
                {touched.fullName && errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>
              {/* Age */}
              <div className={fg('age')}>
                <label htmlFor="age">
                  <span className="label-en">2. Age</span>
                  <span className="label-ml ml-sub">വയസ്സ്</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-solid fa-cake-candles input-icon"></i>
                  <input type="number" id="age" name="age" value={form.age}
                    onChange={handleChange} onBlur={handleBlur}
                    min="5" max="115" placeholder="e.g. 35" />
                </div>
                {touched.age && errors.age && <span className="field-error">{errors.age}</span>}
              </div>
              {/* Mobile */}
              <div className={`${fg('mobileNumber')} span-3`}>
                <label htmlFor="mobileNumber">
                  <span className="label-en">3. Mobile Number</span>
                  <span className="label-ml ml-sub">മൊബൈൽ നമ്പർ</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-brands fa-whatsapp input-icon input-icon-wa"></i>
                  <input type="tel" id="mobileNumber" name="mobileNumber" value={form.mobileNumber}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. 9847012345 (10-digit mobile number)" maxLength="10" inputMode="numeric" />
                </div>
                {touched.mobileNumber && errors.mobileNumber && <span className="field-error">{errors.mobileNumber}</span>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Location & Unit */}
          <div className="form-section">
            <div className="section-badge-bar">
              <span className="step-circle">2</span>
              <div className="section-title-wrap">
                <h3 className="section-title-en">Location &amp; Organization Unit</h3>
                <small className="section-sub-ml ml-sub">സ്ഥലവും സംഘടന ഘടകവും (Place, Panchayat, Unit)</small>
              </div>
            </div>
            <div className="form-grid-3">
              {/* Place */}
              <div className={fg('place')}>
                <label htmlFor="place">
                  <span className="label-en">4. Place / Locality</span>
                  <span className="label-ml ml-sub">സ്ഥലം</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-solid fa-location-dot input-icon"></i>
                  <input type="text" id="place" name="place" value={form.place}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Parappa, Chittarikkal... (പരപ്പ, ചിറ്റാരിക്കൽ...)" />
                </div>
                {touched.place && errors.place && <span className="field-error">{errors.place}</span>}
              </div>
              {/* Panchayat */}
              <div className={fg('panchayat')}>
                <label htmlFor="panchayat">
                  <span className="label-en">5. Panchayat</span>
                  <span className="label-ml ml-sub">പഞ്ചായത്ത്</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-solid fa-landmark input-icon"></i>
                  <select id="panchayat" name="panchayat" value={form.panchayat}
                    onChange={handleChange} onBlur={handleBlur}>
                    <option value="">-- പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക / Select --</option>
                    {PANCHAYATS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                    <option value="Other">മറ്റുള്ളവ / Other</option>
                  </select>
                </div>
                {form.panchayat === 'Other' && (
                  <div className="input-wrap" style={{ marginTop: '8px' }}>
                    <i className="fa-solid fa-pen input-icon"></i>
                    <input type="text" name="customPanchayat" value={form.customPanchayat || ''}
                      onChange={handleChange}
                      placeholder="Enter Panchayat name (പഞ്ചായത്ത് രേഖപ്പെടുത്തുക)" />
                  </div>
                )}
                {touched.panchayat && errors.panchayat && <span className="field-error">{errors.panchayat}</span>}
              </div>
              {/* Unit */}
              <div className={fg('unit')}>
                <label htmlFor="unit">
                  <span className="label-en">6. Unit / Branch</span>
                  <span className="label-ml ml-sub">ശാഖ / യൂണിറ്റ്</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-solid fa-sitemap input-icon"></i>
                  <select id="unit" name="unit" value={form.unit}
                    onChange={handleChange} onBlur={handleBlur}>
                    <option value="">-- ശാഖ തിരഞ്ഞെടുക്കുക / Select Branch --</option>
                    {BRANCHES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                    <option value="Other">മറ്റുള്ളവ / Other Branch</option>
                  </select>
                </div>
                {form.unit === 'Other' && (
                  <div className="input-wrap" style={{ marginTop: '8px' }}>
                    <i className="fa-solid fa-pen input-icon"></i>
                    <input type="text" name="customUnit" value={form.customUnit || ''}
                      onChange={handleChange}
                      placeholder="Enter Branch name (ശാഖയുടെ പേര് രേഖപ്പെടുത്തുക)" />
                  </div>
                )}
                {touched.unit && errors.unit && <span className="field-error">{errors.unit}</span>}
              </div>
            </div>
          </div>

          {/* SECTION 3: Work & Qualification */}
          <div className="form-section">
            <div className="section-badge-bar">
              <span className="step-circle">3</span>
              <div className="section-title-wrap">
                <h3 className="section-title-en">Professional &amp; Educational Background</h3>
                <small className="section-sub-ml ml-sub">തൊഴിലും വിദ്യാഭ്യാസ യോഗ്യതയും (Work, Highest Education)</small>
              </div>
            </div>
            <div className="form-grid-2">
              {/* Work */}
              <div className={fg('work')}>
                <label htmlFor="work">
                  <span className="label-en">7. Work / Occupation</span>
                  <span className="label-ml ml-sub">തൊഴിൽ</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-solid fa-briefcase input-icon"></i>
                  <input type="text" id="work" name="work" value={form.work}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Business, Farmer, Private Job... (തൊഴിൽ രേഖപ്പെടുത്തുക)" />
                </div>
                {touched.work && errors.work && <span className="field-error">{errors.work}</span>}
              </div>
              {/* Qualification */}
              <div className={fg('qualification')}>
                <label htmlFor="qualification">
                  <span className="label-en">8. Highest Educational Qualification</span>
                  <span className="label-ml ml-sub">ഉയർന്ന വിദ്യാഭ്യാസ യോഗ്യത</span>
                  <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <i className="fa-solid fa-graduation-cap input-icon"></i>
                  <input type="text" id="qualification" name="qualification" value={form.qualification}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. SSLC, Plus Two, Degree... (വിദ്യാഭ്യാസ യോഗ്യത രേഖപ്പെടുത്തുക)" />
                </div>
                {touched.qualification && errors.qualification && <span className="field-error">{errors.qualification}</span>}
              </div>
            </div>
          </div>

          {/* SECTION 4: Photo Upload (Cloudinary) */}
          <div className={`form-section photo-upload-section${photoError ? ' has-error' : ''}`}>
            <div className="section-badge-bar">
              <span className="step-circle">4</span>
              <div className="section-title-wrap">
                <h3 className="section-title-en">
                  Delegate Photo <span className="req">*</span>
                </h3>
                <small className="section-sub-ml ml-sub">ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക (നിർബന്ധം)</small>
              </div>
            </div>
            <div className="photo-upload-container">
              <div>
                {!photoPreview ? (
                  <div
                    className={`drop-zone${dragOver ? ' drag-over' : ''}${photoError ? ' has-error' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" className="file-hidden-input" onChange={handleFileInput}/>
                    <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="file-hidden-input" onChange={handleFileInput}/>
                    <div className="drop-zone-idle">
                      <div className="upload-avatar-circle"><i className="fa-solid fa-camera-retro"></i></div>
                      <h4>Upload Delegate Photo <span className="req">*</span></h4>
                      <p>Drag &amp; drop or click to browse<br/><span className="ml-sub">ഫോട്ടോ ഇവിടെ ഇടുക</span></p>
                      <div className="photo-btns-row">
                        <button type="button" className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); fileInputRef.current.click() }}>
                          <i className="fa-solid fa-folder-open"></i> Browse File
                        </button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); cameraInputRef.current.click() }}>
                          <i className="fa-solid fa-camera"></i> Camera
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="photo-result-box">
                    <div className="photo-badge-card">
                      <div className="photo-crop-frame">
                        <img src={photoPreview} alt="Preview"/>
                        <div className="verified-checkmark"><i className="fa-solid fa-check"></i></div>
                      </div>
                      <div className="photo-badge-details">
                        <div className="status-ready-pill"><i className="fa-solid fa-circle-check"></i> Photo Ready</div>
                        <p className="photo-meta">Will be uploaded to Cloudinary on submission</p>
                        <button type="button" className="btn-clear-photo" onClick={clearPhoto}>
                          <i className="fa-solid fa-trash"></i> Remove Photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {photoError && (
                  <span className="field-error photo-field-error" style={{ display: 'block', marginTop: '10px' }}>
                    {photoError}
                  </span>
                )}
              </div>
              
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit-row">
            <button type="submit" className="btn btn-primary btn-submit-large" disabled={submitting || photoUploading}>
              <i className={`fa-solid ${submitting ? 'fa-circle-notch fa-spin' : 'fa-paper-plane'}`}></i>
              <div className="btn-text-wrap">
                <span className="btn-primary-text">
                  {photoUploading ? 'Uploading Photo...' : submitting ? 'Submitting...' : 'Submit Registration'}
                </span>
                <small className="btn-sub-ml ml-sub">
                  {submitting ? 'സമർപ്പിക്കുന്നു...' : 'വിവരങ്ങൾ സമർപ്പിക്കുക'}
                </small>
              </div>
              {!submitting && <i className="fa-solid fa-arrow-right"></i>}
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}
