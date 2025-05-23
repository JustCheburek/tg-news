"use client"

import { useState, useEffect } from "react"

interface Currency {
  name: string
  value: number
  change: number
  symbol?: string
}

interface CurrenciesResponse {
  currencies: Currency[]
  lastUpdated: string
}

export function useCurrencies() {
  const [data, setData] = useState<CurrenciesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCurrencies = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Получаем курсы фиатных валют от ExchangeRate-API
      const [usdResponse, eurResponse, cnyResponse] = await Promise.all([
        fetch("https://api.exchangerate-api.com/v4/latest/USD"),
        fetch("https://api.exchangerate-api.com/v4/latest/EUR"),
        fetch("https://api.exchangerate-api.com/v4/latest/CNY"),
      ])

      const [usdData, eurData, cnyData] = await Promise.all([
        usdResponse.json(),
        eurResponse.json(),
        cnyResponse.json(),
      ])

      // Получаем курс биткоина от CoinGecko
      const cryptoResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=rub&include_24hr_change=true",
      )
      const cryptoData = await cryptoResponse.json()

      const currencies: Currency[] = [
        {
          name: "Доллар",
          value: usdData.rates.RUB,
          change: Math.random() * 2 - 1, // Случайное изменение
          symbol: "USD",
        },
        {
          name: "Евро",
          value: eurData.rates.RUB,
          change: Math.random() * 2 - 1,
          symbol: "EUR",
        },
        {
          name: "Юань",
          value: cnyData.rates.RUB,
          change: Math.random() * 2 - 1,
          symbol: "CNY",
        },
        {
          name: "Биткоин",
          value: cryptoData.bitcoin.rub,
          change: cryptoData.bitcoin.rub_24h_change || 0,
          symbol: "BTC",
        },
      ]

      setData({
        currencies,
        lastUpdated: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Ошибка при загрузке курсов валют:", err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies()

    // Обновляем курсы каждые 10 минут
    const interval = setInterval(fetchCurrencies, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchCurrencies,
  }
}
