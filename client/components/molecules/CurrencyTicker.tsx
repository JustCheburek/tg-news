import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface Currency {
  name: string
  value: number
  change: number
}

interface CurrencyTickerProps {
  currencies: Currency[]
}

export default function CurrencyTicker({ currencies }: CurrencyTickerProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Курс валют</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currencies.map((currency) => (
            <div key={currency.name} className="flex items-center justify-between">
              <span className="font-medium">{currency.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.value.toLocaleString("ru-RU")} руб.</span>
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
