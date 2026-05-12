import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

const MusicToggle = forwardRef(function MusicToggle(props, ref) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useImperativeHandle(ref, () => ({
    play() {
      const audio = audioRef.current
      if (!audio) return
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    },
  }))

  useEffect(() => {
    const audio = new Audio('/music/song.mp3')
    audio.loop = true
    audio.volume = 0.25
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? 'Matikan musik' : 'Putar musik'}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-pointer"
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zM16 17c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
        </svg>
      )}
    </button>
  )
})

export default MusicToggle
