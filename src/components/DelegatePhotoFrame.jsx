import { useState } from 'react'
import toast from 'react-hot-toast'
import frameTemplateImg from '../assets/Frame.jpeg'
import avatarPlaceholderImg from '../assets/avatar-placeholder.png'

export default function DelegatePhotoFrame({
  photoUrl,
  name,
  locality,
  unit,
  registrationId,
  showDownload = true,
  photoAdjust  // { zoom, offsetX, offsetY } from ImageAdjustModal
}) {
  const [downloading, setDownloading] = useState(false)
  const [fitMode, setFitMode] = useState('cover') // 'cover' | 'contain'
  const displayName = name?.trim() || 'Your Name'

  // Dynamic font sizing for wider yellow pill
  const nameLen = displayName.length
  let dynamicFontSize = '0.88rem'
  if (nameLen > 30) {
    dynamicFontSize = '0.52rem'
  } else if (nameLen > 24) {
    dynamicFontSize = '0.60rem'
  } else if (nameLen > 18) {
    dynamicFontSize = '0.70rem'
  } else if (nameLen > 12) {
    dynamicFontSize = '0.80rem'
  }

  function handleDownload() {
    setDownloading(true)
    const toastId = toast.loading('Generating high-resolution frame...')

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = 819
    const height = 1024
    canvas.width = width
    canvas.height = height

    // Frame coordinates calibrated to 819 x 1024 template (top 55%, height 34.2%, pill top 83.15%, left 49%, width 44%)
    const photoX = 80
    const photoY = 563
    const photoW = 277
    const photoH = 350
    const photoRadius = 32

    const pillX = 401
    const pillY = 851
    const pillW = 360
    const pillH = 45
    const pillRadius = 22.5

    const template = new Image()
    template.crossOrigin = 'anonymous'

    template.onload = () => {
      // 1. Draw base frame template
      ctx.drawImage(template, 0, 0, width, height)

      // 2. Draw delegate photo or avatar placeholder
      if (photoUrl) {
        const userImg = new Image()
        userImg.crossOrigin = 'anonymous'
        userImg.onload = () => {
          drawUserPhoto(userImg)
          drawNamePill()
          finishDownload()
        }
        userImg.onerror = () => {
          drawAvatarPlaceholder(() => {
            drawNamePill()
            finishDownload()
          })
        }
        userImg.src = photoUrl
      } else {
        drawAvatarPlaceholder(() => {
          drawNamePill()
          finishDownload()
        })
      }
    }

    template.onerror = () => {
      toast.error('Could not load frame template', { id: toastId })
      setDownloading(false)
    }

    template.src = frameTemplateImg

    function drawUserPhoto(img) {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius)
      ctx.clip()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(photoX, photoY, photoW, photoH)

      const imgRatio = img.width / img.height
      const targetRatio = photoW / photoH
      let dw, dh, dx, dy

      // If user applied adjustments via ImageAdjustModal, honour them
      const adjZoom    = photoAdjust?.zoom    ?? 1
      const adjOffsetX = photoAdjust?.offsetX ?? 0
      const adjOffsetY = photoAdjust?.offsetY ?? 0
      const hasAdj = adjZoom !== 1 || adjOffsetX !== 0 || adjOffsetY !== 0

      if (hasAdj) {
        // Base cover, then apply zoom & pan from adjust modal
        if (imgRatio > targetRatio) {
          dh = photoH
          dw = photoH * imgRatio
        } else {
          dw = photoW
          dh = photoW / imgRatio
        }
        dw *= adjZoom
        dh *= adjZoom
        // Center + user pan offset
        const maxOffsetX = Math.max(0, (dw - photoW) / 2)
        const maxOffsetY = Math.max(0, (dh - photoH) / 2)
        const safeOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, adjOffsetX))
        const safeOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, adjOffsetY))
        dx = photoX + (photoW - dw) / 2 + safeOffsetX
        dy = photoY + (photoH - dh) / 2 + safeOffsetY
      } else if (fitMode === 'contain') {
        // object-fit: contain — show full image, letterboxed
        if (imgRatio > targetRatio) {
          dw = photoW
          dh = photoW / imgRatio
          dx = photoX
          dy = photoY + (photoH - dh) / 2
        } else {
          dh = photoH
          dw = photoH * imgRatio
          dx = photoX + (photoW - dw) / 2
          dy = photoY
        }
      } else {
        // object-fit: cover — fill the slot
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
      }

      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.restore()
    }

    function drawAvatarPlaceholder(onDone) {
      const avatarImg = new Image()
      avatarImg.crossOrigin = 'anonymous'
      avatarImg.onload = () => {
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.clip()

        // Center avatar icon with neat padding inside photo box
        const padX = 24
        const padY = 24
        ctx.drawImage(avatarImg, photoX + padX, photoY + padY, photoW - padX * 2, photoH - padY * 2)
        ctx.restore()
        if (onDone) onDone()
      }
      avatarImg.onerror = () => {
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.restore()
        if (onDone) onDone()
      }
      avatarImg.src = avatarPlaceholderImg
    }

    function drawNamePill() {
      // Draw bright sunny yellow pill matching template
      ctx.save()
      ctx.fillStyle = 'rgb(252, 227, 60)'
      ctx.beginPath()
      ctx.roundRect(pillX, pillY, pillW, pillH, pillRadius)
      ctx.fill()

      // Render Delegate Name
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Dynamic font size fitting
      let fontSize = 22
      ctx.font = `bold ${fontSize}px Outfit, "Noto Sans Malayalam", "Manjari", sans-serif`
      const maxTextW = pillW - 14
      while (ctx.measureText(displayName).width > maxTextW && fontSize > 9) {
        fontSize -= 1
        ctx.font = `bold ${fontSize}px Outfit, "Noto Sans Malayalam", "Manjari", sans-serif`
      }

      ctx.fillText(displayName, pillX + pillW / 2, pillY + pillH / 2)
      ctx.restore()
    }

    function finishDownload() {
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
        const a = document.createElement('a')
        a.href = dataUrl
        const cleanName = displayName.replace(/[^a-zA-Z0-9\u0D00-\u0D7F]/g, '_') || 'Delegate'
        a.download = `${cleanName}_IUML_Malayora_Peruma_2026.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success('Framed picture downloaded!', { id: toastId })
      } catch (err) {
        console.error('Download error:', err)
        toast.error('Download failed. Please try again.', { id: toastId })
      } finally {
        setDownloading(false)
      }
    }
  }

  return (
    <div className="delegate-framed-picture-wrapper">
      <div className="official-frame-container">
        {/* Official Background Poster Frame */}
        <img
          src={frameTemplateImg}
          alt="IUML Malayora Peruma 2026 Frame"
          className="official-frame-bg"
        />

        {/* Person's Picture Area (Auto-populated from upload input) */}
        <div className="official-frame-photo-slot">
          {photoUrl ? (
            <>
              <div className="official-frame-photo-viewport">
                <img
                  src={photoUrl}
                  alt={displayName}
                  className="official-frame-user-img"
                  style={photoAdjust && (photoAdjust.zoom !== 1 || photoAdjust.offsetX !== 0 || photoAdjust.offsetY !== 0)
                    ? {
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        transform: `translate(${(photoAdjust.offsetX / 277) * 100}%, ${(photoAdjust.offsetY / 350) * 100}%) scale(${photoAdjust.zoom})`,
                        transformOrigin: 'center center',
                      }
                    : { objectFit: fitMode, objectPosition: 'center center' }
                  }
                />
              </div>
              {/* Expand/Fit toggle icon — bottom-left of photo slot */}
              <button
                type="button"
                className="frame-fit-toggle-btn"
                onClick={() => setFitMode(m => m === 'cover' ? 'contain' : 'cover')}
                title={fitMode === 'cover' ? 'Fit full image in frame' : 'Fill frame with image'}
                aria-label={fitMode === 'cover' ? 'Fit full image in frame' : 'Fill frame with image'}
              >
                <i className={`fa-solid ${fitMode === 'cover' ? 'fa-expand' : 'fa-compress'}`} />
              </button>
            </>
          ) : (
            <div className="official-frame-avatar-box">
              <img src={avatarPlaceholderImg} alt="Default Avatar" className="official-frame-avatar-img" />
            </div>
          )}
        </div>

        {/* Dynamic Yellow Name Pill (Displays full name dynamically) */}
        <div className="official-frame-name-pill" title={displayName}>
          <span className="official-name-text" style={{ fontSize: 10, fontWeight: 600 }}>
            {displayName}
          </span>
        </div>
      </div>

      {showDownload && (
        <button
          type="button"
          className="btn btn-framed-download"
          onClick={handleDownload}
          disabled={downloading}
          title="Download high-resolution official framed picture"
        >
          <i className={`fa-solid ${downloading ? 'fa-circle-notch fa-spin' : 'fa-download'}`}></i>
          <span className="btn-dl-text">{downloading ? 'Creating Frame...' : 'Download Framed Picture'}</span>
          <small className="ml-sub">(ഫ്രെയിം ചെയ്ത ചിത്രം ഡൗൺലോഡ് ചെയ്യുക)</small>
        </button>
      )}
    </div>
  )
}


