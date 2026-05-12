import { useState, useEffect } from 'react'

export default function TypingText({ text, speed = 50, onComplete, className = '', tag: Tag = 'p' }) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setIsComplete(false)
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <Tag className={className}>
      {displayed}
      {!isComplete && <span className="animate-pulse text-rose">|</span>}
    </Tag>
  )
}
