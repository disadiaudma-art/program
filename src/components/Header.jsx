import { useCountdown } from '../hooks/useCountdown'

export default function Header() {
  const { days, hours, minutes, seconds, isEventToday } = useCountdown()

  return (
    <header className="site-header transparent-header">
      <div className="header-inner header-center-only">
        <div className="header-timer-pill" title="Event Countdown: September 27, 2026">
          <i className="fa-regular fa-clock timer-pill-icon"></i>
          {isEventToday ? (
            <span className="timer-today-text">Event Today! • ഇന്ന് സംഗമ ദിനം!</span>
          ) : (
            <div className="timer-segments">
              <div className="timer-unit">
                <span className="timer-num">{days}</span>
                <span className="timer-lbl">DAYS</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-unit">
                <span className="timer-num">{String(hours).padStart(2, '0')}</span>
                <span className="timer-lbl">HRS</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-unit">
                <span className="timer-num">{String(minutes).padStart(2, '0')}</span>
                <span className="timer-lbl">MIN</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-unit">
                <span className="timer-num">{String(seconds).padStart(2, '0')}</span>
                <span className="timer-lbl">SEC</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

