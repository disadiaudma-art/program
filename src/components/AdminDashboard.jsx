import { useState, useEffect, useCallback } from 'react'
import { fetchDelegates, fetchStats, deleteDelegate } from '../api/api'
import { Link } from 'react-router-dom'

const PANCHAYATS = [
  { value: 'all', label: 'All Panchayats (എല്ലാ പഞ്ചായത്തുകളും)' },
  { value: 'കോടോംബേളൂർ', label: 'കോടോംബേളൂർ (Kodom-Belur)' },
  { value: 'കിനാനൂർ കരിന്തളം', label: 'കിനാനൂർ കരിന്തളം (Kinanoor-Karinthalam)' },
  { value: 'ബളാൽ', label: 'ബളാൽ (Balal)' },
]

export default function AdminDashboard() {
  const [delegates, setDelegates] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [panchayat, setPanchayat] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [viewMode, setViewMode] = useState('auto') // 'auto' | 'table' | 'cards'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [dRes, sRes] = await Promise.all([
        fetchDelegates({ page, limit: 20, panchayat: panchayat === 'all' ? undefined : panchayat, search: search || undefined }),
        fetchStats(),
      ])
      setDelegates(dRes.data.data)
      setTotal(dRes.data.total)
      setTotalPages(dRes.data.totalPages)
      setStats(sRes.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, panchayat, search])

  useEffect(() => { load() }, [load])

  async function handleDelete(id) {
    if (!window.confirm('Delete this delegate record? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteDelegate(id)
      load()
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(null)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    load()
  }

  function exportCSV() {
    if (!delegates.length) {
      alert('No delegates to export')
      return
    }
    const headers = ['Reg ID', 'Full Name', 'Age', 'Mobile', 'Place', 'Panchayat', 'Unit', 'Work', 'Qualification', 'Registered At']
    const rows = delegates.map(d => [
      `"${d.registrationId || ''}"`,
      `"${d.fullName || ''}"`,
      d.age || '',
      `"${d.mobileNumber || ''}"`,
      `"${d.place || ''}"`,
      `"${d.panchayat || ''}"`,
      `"${d.unit || ''}"`,
      `"${d.work || ''}"`,
      `"${d.qualification || ''}"`,
      `"${new Date(d.createdAt).toLocaleString('en-IN')}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `delegates-export-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="admin-page-wrap">
      {/* Admin Header */}
      <header className="site-header">
        <div className="admin-header-inner container">
          <div className="brand-group">
            <div className="flag-symbol-box">
              <svg viewBox="0 0 100 100" className="flag-svg">
                <rect width="100" height="100" rx="18" fill="#008751"/>
                <path d="M55,20 A30,30 0 1,0 80,72 A36,36 0 1,1 55,20 Z" fill="#ffffff"/>
                <polygon points="68,36 71,44 80,44 73,49 76,57 68,52 61,57 63,49 57,44 65,44" fill="#ffffff"/>
              </svg>
            </div>
            <div className="brand-titles">
              <span className="brand-sub-badge">Admin Dashboard</span>
              <h1 className="brand-main-title">IUML Malayora Zone — Registrations</h1>
              <p className="brand-tagline">Kudumba Sangamam 2026 · Delegate Records</p>
            </div>
          </div>
          <Link to="/" className="btn btn-admin-nav btn-sm">
            <i className="fa-solid fa-arrow-left"></i> Back to Registration
          </Link>
        </div>
      </header>

      <div className="admin-container container">

        {/* Stats Cards */}
        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card" style={{background: 'linear-gradient(135deg, #008751 0%, #005c37 100%)', boxShadow: '0 6px 18px rgba(0,135,81,0.25)'}}>
              <i className="fa-solid fa-users" style={{fontSize:'1.6rem',marginBottom:4}}></i>
              <div className="admin-stat-num">{stats.total}</div>
              <div className="admin-stat-lbl">Total Delegates</div>
            </div>
            <div className="admin-stat-card" style={{background: 'linear-gradient(135deg, #0b598d 0%, #083c5e 100%)', boxShadow: '0 6px 18px rgba(11,89,141,0.25)'}}>
              <i className="fa-solid fa-landmark" style={{fontSize:'1.6rem',marginBottom:4}}></i>
              <div className="admin-stat-num">{stats.byPanchayat?.length || 0}</div>
              <div className="admin-stat-lbl">Panchayats</div>
            </div>
            <div className="admin-stat-card" style={{background: 'linear-gradient(135deg, #b8860b 0%, #856108 100%)', boxShadow: '0 6px 18px rgba(184,134,11,0.25)'}}>
              <i className="fa-solid fa-cake-candles" style={{fontSize:'1.6rem',marginBottom:4}}></i>
              <div className="admin-stat-num">{stats.averageAge}</div>
              <div className="admin-stat-lbl">Average Age</div>
            </div>
            <div className="admin-stat-card" style={{background: 'linear-gradient(135deg, #5a189a 0%, #3c096c 100%)', boxShadow: '0 6px 18px rgba(90,24,154,0.25)'}}>
              <i className="fa-solid fa-graduation-cap" style={{fontSize:'1.6rem',marginBottom:4}}></i>
              <div className="admin-stat-num">{stats.byQualification?.length || 0}</div>
              <div className="admin-stat-lbl">Qualifications</div>
            </div>
          </div>
        )}

        {/* Panchayat Breakdown */}
        {stats?.byPanchayat?.length > 0 && (
          <div className="admin-card-box">
            <h3 style={{fontSize:'0.95rem',marginBottom:12,color:'var(--c-forest-deep)',display:'flex',alignItems:'center',gap:8}}>
              <i className="fa-solid fa-chart-pie" style={{color:'var(--c-iuml-green)'}}></i>
              Registrations by Panchayat (പഞ്ചായത്ത് തിരിച്ചുള്ള കണക്ക്)
            </h3>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {stats.byPanchayat.map(p => (
                <div key={p._id} style={{background:'#f0faf3',border:'1px solid #c2e5cf',borderRadius:10,padding:'8px 14px',display:'flex',flexDirection:'column',alignItems:'center',minWidth:110,flex:'1 1 auto'}}>
                  <span style={{fontSize:'1.5rem',fontWeight:800,color:'var(--c-iuml-green)',lineHeight:1.1}}>{p.count}</span>
                  <span style={{fontSize:'0.75rem',color:'var(--c-text-muted)',fontWeight:600,marginTop:2,textAlign:'center'}}>{p._id}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="admin-card-box">
          <form onSubmit={handleSearch} className="admin-filter-form">
            <div className="admin-filter-search">
              <label style={{display:'block',fontSize:'0.82rem',fontWeight:700,marginBottom:6,color:'var(--c-forest-deep)'}}>
                Search (Name / Mobile / Place / ID)
              </label>
              <div className="input-wrap">
                <i className="fa-solid fa-search input-icon"></i>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search delegates..." style={{paddingLeft:42}}/>
              </div>
            </div>
            <div className="admin-filter-panchayat">
              <label style={{display:'block',fontSize:'0.82rem',fontWeight:700,marginBottom:6,color:'var(--c-forest-deep)'}}>Panchayat</label>
              <div className="input-wrap">
                <i className="fa-solid fa-landmark input-icon"></i>
                <select value={panchayat} onChange={e => { setPanchayat(e.target.value); setPage(1) }} style={{paddingLeft:42}}>
                  {PANCHAYATS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-filter-btns">
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="fa-solid fa-filter"></i> Filter
              </button>
              <button type="button" className="btn btn-secondary btn-sm"
                onClick={() => { setSearch(''); setPanchayat('all'); setPage(1) }}>
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={exportCSV}
                style={{borderColor:'var(--c-iuml-green)',color:'var(--c-iuml-green)'}}>
                <i className="fa-solid fa-file-csv"></i> Export CSV
              </button>
            </div>
          </form>
        </div>

        {/* Records Container */}
        <div className="admin-card-box" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #e8f0eb',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10,background:'#fbfdfb'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <h3 style={{fontSize:'1rem',color:'var(--c-forest-deep)',margin:0,display:'flex',alignItems:'center'}}>
                <i className="fa-solid fa-list-check" style={{marginRight:8,color:'var(--c-iuml-green)'}}></i>
                Delegate Records
                <span style={{background:'#e6f6ec',color:'var(--c-iuml-green)',padding:'2px 8px',borderRadius:50,fontSize:'0.75rem',fontWeight:800,marginLeft:8}}>{total}</span>
              </h3>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className="admin-view-toggle">
                <button type="button" className={`admin-toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')} title="Table View">
                  <i className="fa-solid fa-table"></i>
                </button>
                <button type="button" className={`admin-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')} title="Card View">
                  <i className="fa-solid fa-grip-vertical"></i>
                </button>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={load}>
                <i className="fa-solid fa-arrows-rotate"></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{padding:60,textAlign:'center',color:'var(--c-text-muted)'}}>
              <i className="fa-solid fa-circle-notch fa-spin" style={{fontSize:'2rem',color:'var(--c-iuml-green)'}}></i>
              <p style={{marginTop:12}}>Loading delegates...</p>
            </div>
          ) : delegates.length === 0 ? (
            <div style={{padding:60,textAlign:'center',color:'var(--c-text-muted)'}}>
              <i className="fa-solid fa-inbox" style={{fontSize:'2.5rem',opacity:0.4}}></i>
              <p style={{marginTop:12}}>No delegate records found.</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className={viewMode === 'cards' ? 'admin-cards-mobile' : viewMode === 'table' ? 'admin-table-desktop' : 'admin-table-desktop'}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.86rem'}}>
                    <thead>
                      <tr style={{background:'#f4faf6',borderBottom:'1px solid #d8ebd9'}}>
                        {['#','Reg ID','Photo','Name','Age','Mobile','Place','Panchayat','Unit / Branch','Work','Qualification','Date','Action'].map(h=>(
                          <th key={h} style={{padding:'10px 14px',textAlign:'left',fontWeight:700,color:'var(--c-forest-deep)',whiteSpace:'nowrap'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {delegates.map((d, i) => (
                        <tr key={d._id} style={{borderBottom:'1px solid #f0f6f1',transition:'background 0.15s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='#f9fcf9'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{padding:'10px 14px',color:'var(--c-text-muted)',fontWeight:600}}>{(page-1)*20+i+1}</td>
                          <td style={{padding:'10px 14px'}}>
                            <span style={{background:'#e6f6ec',color:'var(--c-iuml-green)',padding:'3px 8px',borderRadius:50,fontSize:'0.75rem',fontWeight:800,whiteSpace:'nowrap'}}>
                              {d.registrationId || '—'}
                            </span>
                          </td>
                          <td style={{padding:'10px 14px'}}>
                            {d.photoUrl ? (
                              <img src={d.photoUrl} alt={d.fullName} onClick={()=>setSelectedPhoto(d.photoUrl)}
                                style={{width:36,height:44,objectFit:'cover',borderRadius:5,border:'2px solid #008751',cursor:'pointer'}}/>
                            ) : (
                              <div style={{width:36,height:44,borderRadius:5,background:'#edf7f0',display:'flex',alignItems:'center',justifyContent:'center',color:'#9cb8a6'}}>
                                <i className="fa-solid fa-user" style={{fontSize:'0.9rem'}}></i>
                              </div>
                            )}
                          </td>
                          <td style={{padding:'10px 14px',fontWeight:700,color:'var(--c-forest-deep)'}}>{d.fullName}</td>
                          <td style={{padding:'10px 14px'}}>{d.age}</td>
                          <td style={{padding:'10px 14px',whiteSpace:'nowrap'}}>
                            <a href={`https://wa.me/91${d.mobileNumber}`} target="_blank" rel="noreferrer"
                              style={{color:'var(--c-forest-deep)',fontWeight:600,display:'inline-flex',alignItems:'center',gap:4}}>
                              <i className="fa-brands fa-whatsapp" style={{color:'#25d366',fontSize:'1.1rem'}}></i>
                              {d.mobileNumber}
                            </a>
                          </td>
                          <td style={{padding:'10px 14px'}}>{d.place}</td>
                          <td style={{padding:'10px 14px'}}>
                            <span style={{background:'#edf7f0',border:'1px solid #cce5d4',padding:'2px 8px',borderRadius:50,fontSize:'0.75rem',fontWeight:600,color:'var(--c-forest-deep)',whiteSpace:'nowrap'}}>
                              {d.panchayat}
                            </span>
                          </td>
                          <td style={{padding:'10px 14px',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.unit}</td>
                          <td style={{padding:'10px 14px',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.work}</td>
                          <td style={{padding:'10px 14px',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.qualification}</td>
                          <td style={{padding:'10px 14px',fontSize:'0.76rem',color:'var(--c-text-muted)',whiteSpace:'nowrap'}}>
                            {new Date(d.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td style={{padding:'10px 14px'}}>
                            <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(d._id)} disabled={deleting===d._id}
                              style={{padding:'4px 10px',fontSize:'0.76rem'}}>
                              {deleting===d._id ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-trash"></i>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className={viewMode === 'table' ? 'admin-cards-mobile' : viewMode === 'cards' ? 'admin-table-desktop' : 'admin-cards-mobile'}
                style={{padding:'14px'}}>
                {delegates.map((d, i) => (
                  <div key={d._id} className="delegate-mobile-card">
                    <div className="dmc-header">
                      {d.photoUrl ? (
                        <img src={d.photoUrl} alt={d.fullName} className="dmc-photo" onClick={()=>setSelectedPhoto(d.photoUrl)} />
                      ) : (
                        <div className="dmc-photo-placeholder">
                          <i className="fa-solid fa-user"></i>
                        </div>
                      )}
                      <div className="dmc-info-top">
                        <div className="dmc-name">{d.fullName}</div>
                        <div className="dmc-badges">
                          <span style={{background:'#e6f6ec',color:'var(--c-iuml-green)',padding:'2px 8px',borderRadius:50,fontSize:'0.72rem',fontWeight:800}}>
                            {d.registrationId || `#${(page-1)*20+i+1}`}
                          </span>
                          <span style={{fontSize:'0.74rem',color:'var(--c-text-muted)'}}>{d.age} yrs</span>
                        </div>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(d._id)} disabled={deleting===d._id}
                        style={{padding:'6px 10px',borderRadius:8}}>
                        {deleting===d._id ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-trash"></i>}
                      </button>
                    </div>

                    <div className="dmc-grid">
                      <div>
                        <span className="dmc-item-label">Panchayat (പഞ്ചായത്ത്)</span>
                        <span className="dmc-item-val">{d.panchayat}</span>
                      </div>
                      <div>
                        <span className="dmc-item-label">Unit / Branch (ശാഖ)</span>
                        <span className="dmc-item-val">{d.unit}</span>
                      </div>
                      <div>
                        <span className="dmc-item-label">Place (സ്ഥലം)</span>
                        <span className="dmc-item-val">{d.place}</span>
                      </div>
                      <div>
                        <span className="dmc-item-label">Work & Qualification</span>
                        <span className="dmc-item-val">{d.work} · {d.qualification}</span>
                      </div>
                    </div>

                    <div className="dmc-actions">
                      <a href={`https://wa.me/91${d.mobileNumber}`} target="_blank" rel="noreferrer"
                        className="btn btn-whatsapp btn-sm" style={{flex:1,justifyContent:'center',fontSize:'0.82rem',padding:'6px 12px'}}>
                        <i className="fa-brands fa-whatsapp"></i> {d.mobileNumber}
                      </a>
                      <span style={{fontSize:'0.72rem',color:'var(--c-text-muted)'}}>
                        {new Date(d.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{padding:'14px 20px',borderTop:'1px solid #e8f0eb',display:'flex',justifyContent:'center',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                <i className="fa-solid fa-chevron-left"></i> Prev
              </button>
              <span style={{fontSize:'0.82rem',color:'var(--c-text-muted)',padding:'0 10px'}}>
                Page {page} of {totalPages} ({total} delegates)
              </span>
              <button className="btn btn-secondary btn-sm" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>
                Next <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="modal-overlay active" onClick={()=>setSelectedPhoto(null)}
          style={{cursor:'pointer'}}>
          <img src={selectedPhoto} alt="Delegate" style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:12,boxShadow:'0 20px 60px rgba(0,0,0,0.5)'}}/>
        </div>
      )}
    </div>
  )
}
