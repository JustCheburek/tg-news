import Logo from "@/components/atoms/Logo"
import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/" className="font-medium transition-colors hover:text-green-600">
                Новости
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
