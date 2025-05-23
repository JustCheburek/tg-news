import type { ReactNode } from "react"

interface TypographyProps {
  children: ReactNode
  className?: string
}

export function Heading1({ children, className = "" }: TypographyProps) {
  return <h1 className={`text-3xl font-bold leading-tight md:text-4xl ${className}`}>{children}</h1>
}

export function Heading2({ children, className = "" }: TypographyProps) {
  return <h2 className={`text-2xl font-bold leading-tight md:text-3xl ${className}`}>{children}</h2>
}

export function Lead({ children, className = "" }: TypographyProps) {
  return <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
}

export function BodyText({ children, className = "" }: TypographyProps) {
  return <p className={`text-base ${className}`}>{children}</p>
}
