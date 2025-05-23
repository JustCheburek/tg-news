import Logo from "@/components/atoms/Logo"

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <Logo />
      </div>
    </header>
  )
}
