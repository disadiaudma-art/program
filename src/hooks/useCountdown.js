import { useState, useEffect } from 'react'

export function useCountdown() {
  const [display, setDisplay] = useState('')
  const [displayMl, setDisplayMl] = useState('')

  useEffect(() => {
    function update() {
      const eventDate = new Date('2026-09-26T09:00:00+05:30').getTime()
      const now = Date.now()
      const diff = eventDate - now

      if (diff <= 0) {
        setDisplay('Event Today!')
        setDisplayMl('ഇന്ന് സംഗമ ദിനം!')
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      setDisplay(`${days} Days, ${hours} Hours Left`)
      setDisplayMl(`ബാക്കി: ${days} ദിവസം, ${hours} മണിക്കൂർ`)
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

  return { display, displayMl }
}
