import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'

interface AnimatedNumberProps {
  value: number
  format: (value: number) => string
  className?: string
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const previous = useRef(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reduceMotion) {
      node.textContent = format(value)
      previous.current = value
      return
    }

    const controls = animate(previous.current, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest)
      },
    })
    previous.current = value
    return () => controls.stop()
  }, [value, format, reduceMotion])

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  )
}
