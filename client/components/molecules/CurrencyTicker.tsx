"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react"

interface Currency {
  name: string
  value: number
  change: number
}

interface CurrencyTickerProps {
  currencies: Currency[]
  lastUpdated?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function CurrencyTicker({
  currencies,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: CurrencyTickerProps) {
  const formatValue = (value: number, currency: string) => {
    if (currency === "Биткоин") {
      return `${Math.round(value).toLocaleString("ru-RU")} ₽`
    }
    return `${value.toFixed(2)} ₽`
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Курс валют</CardTitle>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              title="Обновить курсы"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
        {lastUpdated && <p className="text-xs text-muted-foreground">Обновлено: {formatTime(lastUpdated)}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currencies.map((currency) => (
            <div key={currency.name} className="flex items-center justify-between">
              <span className="font-medium">{currency.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatValue(currency.value, currency.name)}</span>
                <span
                  className={`flex items-center text-sm ${currency.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {currency.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(currency.change).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
