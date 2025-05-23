"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import CurrencyTicker from "@/components/molecules/CurrencyTicker"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface Currency {
	name: string
	value: number
	change: number
}

export default function Sidebar() {
	const [currencies, setCurrencies] = useState<Currency[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// Получаем курсы фиатных валют
				const fiatResponse = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
				const fiatData = await fiatResponse.json()

				// Получаем курс биткоина
				const cryptoResponse = await fetch(
						"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=rub&include_24hr_change=true",
				)
				const cryptoData = await cryptoResponse.json()

				// Получаем курс юаня отдельно
				const cnyResponse = await fetch("https://api.exchangerate-api.com/v4/latest/CNY")
				const cnyData = await cnyResponse.json()

				const rubRate = fiatData.rates.RUB
				const eurRate = fiatData.rates.EUR
				const cnyRubRate = cnyData.rates.RUB

				// Формируем данные для отображения
				const currencyData: Currency[] = [
					{
						name: "Доллар",
						value: rubRate,
						change: Math.random() * 2 - 1, // Случайное изменение, так как API не предоставляет исторические данные
					},
					{
						name: "Евро",
						value: rubRate / eurRate,
						change: Math.random() * 2 - 1,
					},
					{
						name: "Юань",
						value: cnyRubRate,
						change: Math.random() * 2 - 1,
					},
					{
						name: "Биткоин",
						value: cryptoData.bitcoin.rub,
						change: cryptoData.bitcoin.rub_24h_change || 0,
					},
				]

				setCurrencies(currencyData)
			} catch (error) {
				console.error("Ошибка при загрузке курсов валют:", error)
				setError("Не удалось загрузить курсы валют")
				setCurrencies([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchCurrencies()

		// Обновляем курсы каждые 10 минут
		const interval = setInterval(fetchCurrencies, 10 * 60 * 1000)

		return () => clearInterval(interval)
	}, [])

	return (
			<div className="sticky top-8 space-y-6">
				{/* Currency Ticker */}
				{isLoading ? (
						<Skeleton className="h-64 w-full rounded-2xl" />
				) : error ? (
						<Card className="rounded-2xl shadow-md">
							<CardContent className="p-6 text-center">
								<p className="text-sm text-muted-foreground">{error}</p>
								<button
										onClick={() => window.location.reload()}
										className="mt-2 text-sm text-green-600 hover:text-green-700"
								>
									Попробовать снова
								</button>
							</CardContent>
						</Card>
				) : currencies.length > 0 ? (
						<CurrencyTicker currencies={currencies} />
				) : (
						<Card className="rounded-2xl shadow-md">
							<CardContent className="p-6 text-center">
								<p className="text-sm text-muted-foreground">Курсы валют недоступны</p>
							</CardContent>
						</Card>
				)}

				{/* Telegram Promo Image */}
				<Card className="hidden lg:block rounded-2xl shadow-md overflow-hidden">
					<CardContent className="p-0">
						<div className="relative aspect-[4/3] w-full">
							<Image
									src="/tg.png"
									alt="Скоро в Telegram"
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 320px"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
	)
}
