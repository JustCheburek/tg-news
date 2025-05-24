import Logo from "@/components/atoms/Logo"
import { ThemeToggle } from "../atoms/ThemeToggle"

export default function Header() {
	return (
			<header className="border-b bg-background sticky top-0 z-10">
				<div className="container mx-auto flex h-16 items-center justify-center px-4 relative">
					<Logo/>
          <ThemeToggle/>
				</div>
			</header>
	)
}
