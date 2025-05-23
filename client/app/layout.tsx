import type React from "react"
import type {Metadata} from "next/dist/lib/metadata/types/metadata-interface"
import {Inter} from "next/font/google"
import "./globals.css"
import Header from "@/components/organisms/Header"
import Footer from "@/components/organisms/Footer"
import {ThemeProvider} from "@/components/theme-provider"

const inter = Inter({subsets: ["latin", "cyrillic"]})

export const metadata: Metadata = {
	title: "EconoNews - Экономические новости",
	description: "Лента экономических новостей из Telegram-каналов",
}

export default function RootLayout(
		{
			children,
		}: Readonly<{
			children: React.ReactNode
		}>) {
	return (
			<html lang="ru">
			<body className={inter.className} suppressHydrationWarning>
			<ThemeProvider defaultTheme="light">
				<div className="flex min-h-screen flex-col">
					<Header/>
					<div className="flex-1 bg-secondary">
						<main className="container mx-auto px-4 py-8">
							<div className="flex flex-col-reverse lg:flex-row gap-8">
								{children}
							</div>
						</main>
					</div>
					<Footer/>
				</div>
			</ThemeProvider>
			</body>
			</html>
	)
}
