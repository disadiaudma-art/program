import { useState, useEffect } from 'react'

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    display: '',
    displayMl: '',
    isEventToday: false
  })

  useEffect(() => {
    function update() {
      const eventDate = new Date('2026-09-27T09:00:00+05:30').getTime()
      const now = Date.now()
      const diff = eventDate - now

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          display: 'Event Today!',
          displayMl: 'ഇന്ന് സംഗമ ദിനം!',
          isEventToday: true
        })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        display: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        displayMl: `${days} ദിവസം ${hours} മണിക്കൂർ ${minutes} മിനിറ്റ് ${seconds} സെക്കൻഡ്`,
        isEventToday: false
      })
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}

