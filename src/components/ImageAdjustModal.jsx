import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * ImageAdjustModal
 * Props:
 *   src        – blob/object URL of the uploaded image
 *   onApply    – ({ zoom, offsetX, offsetY }) => void
 *   onClose    – () => void
 *   initial    – { zoom, offsetX, offsetY }  (optional, for re-opening with previous state)
 */
export default function ImageAdjustModal({ src, onApply, onClose, initial }) {
  const FRAME_W = 277
  const FRAME_H = 350

  const [zoom, setZoom]       = useState(initial?.zoom    ?? 1)
  const [offsetX, setOffsetX] = useState(initial?.offsetX ?? 0)
  const [offsetY, setOffsetY] = useState(initial?.offsetY ?? 0)
  const [isDragging, setIsDragging] = useState(false)

  const dragging   = useRef(false)
  const lastPos    = useRef({ x: 0, y: 0 })
  const imgRef     = useRef()

  // ── pointer drag ──────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    dragging.current = true
    setIsDragging(true)
    lastPos.current  = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffsetX(ox => {
      const newOx = ox + dx
      const scaledW = FRAME_W * zoom
      const maxX = (scaledW - FRAME_W) / 2
      return Math.max(-maxX, Math.min(maxX, newOx))
    })
    setOffsetY(oy => {
      const newOy = oy + dy
      const scaledH = FRAME_H * zoom
      const maxY = (scaledH - FRAME_H) / 2
      return Math.max(-maxY, Math.min(maxY, newOy))
    })
  }, [zoom])

  const onPointerUp = useCallback((e) => {
    dragging.current = false
    setIsDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  // ── zoom slider ───────────────────────────────────────────────────────────
  function handleZoomChange(e) {
    const z = parseFloat(e.target.value)
    setZoom(z)
    // re-clamp offsets with new zoom
    setOffsetX(ox => {
      const maxX = (FRAME_W * z - FRAME_W) / 2
      return Math.max(-maxX, Math.min(maxX, ox))
    })
    setOffsetY(oy => {
      const maxY = (FRAME_H * z - FRAME_H) / 2
      return Math.max(-maxY, Math.min(maxY, oy))
    })
  }

  // ── reset ─────────────────────────────────────────────────────────────────
  function handleReset() {
    setZoom(1); setOffsetX(0); setOffsetY(0)
  }

  // ── apply ─────────────────────────────────────────────────────────────────
  function handleApply() {
    onApply({ zoom, offsetX, offsetY })
    onClose()
  }

  // ── close on backdrop click ───────────────────────────────────────────────
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // ── keyboard ESC ─────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // ── prevent body scroll while modal open ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const previewStyle = {
    width:  FRAME_W,
    height: FRAME_H,
    overflow: 'hidden',
    position: 'relative',
    cursor: isDragging ? 'grabbing' : 'grab',
    borderRadius: 12,
    userSelect: 'none',
    touchAction: 'none',
    background: '#1a1a1a',
  }

  const imgStyle = {
    position: 'absolute',
    width:  `${zoom * 100}%`,
    height: `${zoom * 100}%`,
    top:  `calc(50% + ${offsetY}px)`,
    left: `calc(50% + ${offsetX}px)`,
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
    objectPosition: 'center',
    pointerEvents: 'none',
    draggable: false,
  }

  const zoomPct = Math.round(((zoom - 1) / (3 - 1)) * 100)

  return (
    <div className="img-adjust-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Adjust your photo">
      <div className="img-adjust-modal">

        {/* Header */}
        <div className="img-adjust-header">
          <div className="img-adjust-title">
            <i className="fa-solid fa-sliders" />
            <span>Adjust Your Photo</span>
            <small className="ml-sub">ഫോട്ടോ ക്രമീകരിക്കുക</small>
          </div>
          <button type="button" className="img-adjust-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="img-adjust-body">

          {/* Canvas preview */}
          <div className="img-adjust-preview-wrap">
            <div className="img-adjust-hint">
              <i className="fa-solid fa-hand" /> Drag to reposition &middot; Slider to zoom
            </div>
            <div
              style={previewStyle}
              onPointerDown={onPointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <img ref={imgRef} src={src} alt="Adjust preview" style={imgStyle} />
              {/* corner guide marks */}
              <div className="adj-guide adj-guide-tl" />
              <div className="adj-guide adj-guide-tr" />
              <div className="adj-guide adj-guide-bl" />
              <div className="adj-guide adj-guide-br" />
            </div>
            <p className="img-adjust-frame-note">
              <i className="fa-solid fa-image-portrait" /> This area matches the photo slot in the official frame
            </p>
          </div>

          {/* Controls */}
          <div className="img-adjust-controls">

            <div className="adj-control-group">
              <div className="adj-control-label">
                <i className="fa-solid fa-magnifying-glass-plus" />
                <span>Zoom</span>
                <span className="adj-val-badge">{zoom.toFixed(2)}&times;</span>
              </div>
              <div className="adj-slider-row">
                <span className="adj-zoom-icon-sm"><i className="fa-solid fa-image" /></span>
                <input
                  type="range"
                  className="adj-slider"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={handleZoomChange}
                />
                <span className="adj-zoom-icon-lg"><i className="fa-solid fa-image" /></span>
              </div>
              <div className="adj-slider-track-bg">
                <div className="adj-slider-fill" style={{ width: `${zoomPct}%` }} />
              </div>
            </div>

            <div className="adj-control-group">
              <div className="adj-control-label">
                <i className="fa-solid fa-arrows-up-down-left-right" />
                <span>Position</span>
                <span className="adj-val-badge">
                  {offsetX > 0 ? '+' : ''}{Math.round(offsetX)}px,&nbsp;
                  {offsetY > 0 ? '+' : ''}{Math.round(offsetY)}px
                </span>
              </div>
              <p className="adj-position-hint">
                <i className="fa-regular fa-hand-pointer" /> Drag the preview image above to reposition
              </p>
            </div>

            <button type="button" className="adj-reset-btn" onClick={handleReset}>
              <i className="fa-solid fa-rotate-left" /> Reset to Default
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="img-adjust-footer">
          <button type="button" className="adj-btn-cancel" onClick={onClose}>
            <i className="fa-solid fa-xmark" /> Cancel
          </button>
          <button type="button" className="adj-btn-apply" onClick={handleApply}>
            <i className="fa-solid fa-check" /> Apply to Frame
            <small className="ml-sub">ഫ്രെയിമിൽ ചേർക്കുക</small>
          </button>
        </div>

      </div>
    </div>
  )
}
