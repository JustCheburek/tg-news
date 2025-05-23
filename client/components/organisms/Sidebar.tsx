"use client"

import { useEffect, useState } from "react"
import CurrencyTicker from "@/components/molecules/CurrencyTicker"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface Currency {
  name: string
  value: number
  change: number
}

export default function Sidebar() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get("/currencies")
        setCurrencies(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Ошибка при загрузке курсов валют:", error)
        // Фейковые данные на случай ошибки
        setCurrencies([
          { name: "Доллар", value: 92.45, change: -0.32 },
          { name: "Евро", value: 98.76, change: 0.15 },
          { name: "Юань", value: 12.85, change: 0.08 },
          { name: "Биткоин", value: 4250000, change: 2.45 },
        ])
        setIsLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />
  }

  return (
    <div className="sticky top-20 space-y-6">
      <CurrencyTicker currencies={currencies} />
    </div>
  )
}
