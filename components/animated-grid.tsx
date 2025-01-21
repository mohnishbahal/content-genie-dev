'use client'

import { useEffect, useRef } from 'react'

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const squares: { x: number; y: number; opacity: number }[] = []
    const squareSize = 20
    const numSquares = 20
    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initSquares()
    }

    const initSquares = () => {
      squares.length = 0
      for (let i = 0; i < numSquares; i++) {
        squares.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          opacity: Math.random(),
        })
      }
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid lines
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += squareSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += squareSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
      }
      ctx.stroke()

      // Draw animated squares
      squares.forEach((square) => {
        ctx.fillStyle = `rgba(0, 0, 0, ${square.opacity * 0.1})`
        const x = Math.floor(square.x / squareSize) * squareSize
        const y = Math.floor(square.y / squareSize) * squareSize
        ctx.fillRect(x, y, squareSize, squareSize)

        // Update square position
        square.x += 0.3
        square.y += 0.3
        square.opacity -= 0.002

        // Reset square when it moves off screen or becomes transparent
        if (square.x > canvas.width || square.y > canvas.height || square.opacity <= 0) {
          square.x = 0
          square.y = Math.random() * canvas.height
          square.opacity = 1
        }
      })

      animationFrameId = requestAnimationFrame(drawGrid)
    }

    // Initial setup
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    drawGrid()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ opacity: 0.7 }}
    />
  )
}

