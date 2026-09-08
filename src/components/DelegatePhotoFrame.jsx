import { useState } from 'react'

export default function DelegatePhotoFrame({ photoUrl, name, locality, unit, registrationId, showDownload = true }) {
  const [downloading, setDownloading] = useState(false)
  const displayName = name?.trim() || 'Delegate Name'
  const displayLocality = [locality?.trim(), unit?.trim()].filter(Boolean).join(' • ') || 'IUML Malayora Zone'

  function handleDownload() {
    setDownloading(true)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = 600
    const height = 750
    canvas.width = width
    canvas.height = height

    // Background - Dark Forest Green Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#072515')
    bgGrad.addColorStop(0.5, '#0b361f')
    bgGrad.addColorStop(1, '#072515')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Outer Gilded Gold Frame Border
    ctx.lineWidth = 14
    ctx.strokeStyle = '#fec300'
    ctx.strokeRect(10, 10, width - 20, height - 20)

    // Inner Thin Gold Inset
    ctx.lineWidth = 2
    ctx.strokeStyle = '#fff2a8'
    ctx.strokeRect(22, 22, width - 44, height - 44)

    // Corner Ornament Accents
    const corners = [
      [22, 22],
      [width - 22, 22],
      [22, height - 22],
      [width - 22, height - 22]
    ]
    ctx.fillStyle = '#ffd214'
    corners.forEach(([cx, cy]) => {
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    // Header Badge / Text
    ctx.fillStyle = '#fec300'
    ctx.font = 'bold 16px Outfit, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('IUML MALAYORA PERUMA • 2026', width / 2, 58)

    ctx.fillStyle = '#c4ded0'
    ctx.font = '13px "Noto Sans Malayalam", sans-serif'
    ctx.fillText('കുടുംബ സംഗമം • പരപ്പ', width / 2, 80)

    // Photo Box coordinates
    const photoX = 65
    const photoY = 100
    const photoW = width - 130
    const photoH = 430

    // Draw Photo Box Matte & Border
    ctx.fillStyle = '#03140b'
    ctx.fillRect(photoX, photoY, photoW, photoH)
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ffd214'
    ctx.strokeRect(photoX, photoY, photoW, photoH)

    function finalizeCanvas() {
      // Bottom Brass Nameplate Plaque
      const plaqueX = 50
      const plaqueY = 555
      const plaqueW = width - 100
      const plaqueH = 125

      const plaqueGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX, plaqueY + plaqueH)
      plaqueGrad.addColorStop(0, '#fff4cc')
      plaqueGrad.addColorStop(0.5, '#ffd214')
      plaqueGrad.addColorStop(1, '#d89b00')
      ctx.fillStyle = plaqueGrad
      ctx.beginPath()
      ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 12)
      ctx.fill()

      ctx.lineWidth = 3
      ctx.strokeStyle = '#072515'
      ctx.stroke()

      // Plaque Inner Border
      ctx.lineWidth = 1
      ctx.strokeStyle = '#8a6200'
      ctx.beginPath()
      ctx.roundRect(plaqueX + 5, plaqueY + 5, plaqueW - 10, plaqueH - 10, 8)
      ctx.stroke()

      // Delegate Name
      ctx.fillStyle = '#072515'
      ctx.font = 'bold 26px Outfit, "Noto Sans Malayalam", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(displayName, width / 2, plaqueY + 45)

      // Locality / Unit
      ctx.fillStyle = '#1c4a2a'
      ctx.font = '600 15px Outfit, "Noto Sans Malayalam", sans-serif'
      ctx.fillText(displayLocality, width / 2, plaqueY + 75)

      // Registration ID or Badge Note
      ctx.fillStyle = '#403000'
      ctx.font = 'bold 12px monospace'
      const idText = registrationId ? `ID: ${registrationId}` : 'DELEGATE PASS 2026'
      ctx.fillText(idText, width / 2, plaqueY + 102)

      // Footer line
      ctx.fillStyle = '#8fad9a'
      ctx.font = '11px Outfit, sans-serif'
      ctx.fillText('Saturday, 26 September 2026 • Parappa Royal Palace Auditorium', width / 2, height - 32)

      // Trigger download
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${displayName.replace(/[^a-zA-Z0-9]/g, '_')}_framed_picture.jpg`
        a.click()
      } catch (err) {
        console.error('Download error:', err)
      } finally {
        setDownloading(false)
      }
    }

    if (photoUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.save()
        ctx.beginPath()
        ctx.rect(photoX, photoY, photoW, photoH)
        ctx.clip()

        const imgRatio = img.width / img.height
        const targetRatio = photoW / photoH
        let dw, dh, dx, dy

        if (imgRatio > targetRatio) {
          dh = photoH
          dw = photoH * imgRatio
          dx = photoX - (dw - photoW) / 2
          dy = photoY
        } else {
          dw = photoW
          dh = photoW / imgRatio
          dx = photoX
          dy = photoY - (dh - photoH) / 2
        }

        ctx.drawImage(img, dx, dy, dw, dh)
        ctx.restore()
        finalizeCanvas()
      }
      img.onerror = () => {
        drawPlaceholderPhoto(ctx, photoX, photoY, photoW, photoH)
        finalizeCanvas()
      }
      img.src = photoUrl
    } else {
      drawPlaceholderPhoto(ctx, photoX, photoY, photoW, photoH)
      finalizeCanvas()
    }
  }

  function drawPlaceholderPhoto(ctx, x, y, w, h) {
    ctx.fillStyle = '#0b361f'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#ffd214'
    ctx.font = 'bold 36px Outfit, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('IUML 2026', x + w / 2, y + h / 2 - 10)
    ctx.font = 'bold 15px Outfit, sans-serif'
    ctx.fillText('DELEGATE PASS', x + w / 2, y + h / 2 + 25)
  }

  return (
    <div className="delegate-framed-picture-wrapper">
      <div className="del-frame-outer">
        {/* Decorative corner bolts */}
        <span className="frame-bolt tl"></span>
        <span className="frame-bolt tr"></span>
        <span className="frame-bolt bl"></span>
        <span className="frame-bolt br"></span>

        {/* Frame Top Header */}
        <div className="del-frame-header">
          <div className="del-frame-crest">
            <i className="fa-solid fa-star-and-crescent"></i>
          </div>
          <div className="del-frame-title">IUML MALAYORA PERUMA • 2026</div>
          <div className="del-frame-sub">കുടുംബ സംഗമം</div>
        </div>

        {/* Picture Canvas Area */}
        <div className="del-frame-photo-area">
          {photoUrl ? (
            <img src={photoUrl} alt={displayName} className="del-frame-photo-img" />
          ) : (
            <div className="del-frame-placeholder">
              <i className="fa-solid fa-user-tie frame-placeholder-icon"></i>
              <span>Photo Preview</span>
              <small className="ml-sub">ഫോട്ടോ ഇവിടെ കാണാം</small>
            </div>
          )}
          <div className="del-frame-gold-matting"></div>
        </div>

        {/* Gilded Brass Nameplate */}
        <div className="del-frame-nameplate">
          <div className="nameplate-inner">
            <div className="nameplate-name">{displayName}</div>
            <div className="nameplate-meta">{displayLocality}</div>
            {registrationId && (
              <div className="nameplate-reg-id">
                <i className="fa-solid fa-id-card"></i> {registrationId}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="del-frame-footer">
          <span>Parappa Royal Palace • 26 Sept 2026</span>
        </div>
      </div>

      {showDownload && (
        <button
          type="button"
          className="btn btn-framed-download"
          onClick={handleDownload}
          disabled={downloading}
          title="Download high-resolution framed picture"
        >
          <i className={`fa-solid ${downloading ? 'fa-circle-notch fa-spin' : 'fa-download'}`}></i>
          <span>{downloading ? 'Generating Frame...' : 'Download Framed Picture'}</span>
          <small className="ml-sub">(ഫ്രെയിം ചെയ്ത ചിത്രം ഡൗൺലോഡ് ചെയ്യുക)</small>
        </button>
      )}
    </div>
  )
}
