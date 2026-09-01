import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'kid'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  color,
  disabled,
  className = '',
  type = 'button',
}: ButtonProps) {
  const base = 'font-semibold rounded-2xl transition-all select-none focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: `bg-violet-600 hover:bg-violet-700 text-white shadow-lg focus:ring-violet-500`,
    secondary: `bg-white border-2 border-violet-200 hover:border-violet-400 text-violet-700 focus:ring-violet-300`,
    ghost: `bg-transparent hover:bg-violet-50 text-violet-600 focus:ring-violet-300`,
    kid: `text-white shadow-xl rounded-3xl focus:ring-pink-400`,
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
    xl: 'px-8 py-5 text-xl min-h-[64px]',
  }

  const style = color && variant === 'kid' ? { backgroundColor: color } : {}

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </motion.button>
  )
}
