import Link from "next/link"
import { TrendingUp } from "lucide-react"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <TrendingUp className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl">EconoNews</span>
    </Link>
  )
}
