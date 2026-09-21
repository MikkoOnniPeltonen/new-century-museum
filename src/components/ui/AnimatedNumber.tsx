import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

/** Counts up/down to `value` with a spring, e.g. for scores. */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 110, damping: 20 })
  const display = useTransform(spring, (current) => Math.round(current).toString())

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={className}>{display}</motion.span>
}
