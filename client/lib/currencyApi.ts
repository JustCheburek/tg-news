// Утилиты для работы с открытыми API курсов валют

interface ExchangeRateResponse {
  base: string
  date: string
  rates: Record<string, number>
}

interface CoinGeckoResponse {
  bitcoin: {
    rub: number
    rub_24h_change: number
  }
}

export class CurrencyApiService {
  private static readonly EXCHANGE_RATE_BASE_URL = "https://api.exchangerate-api.com/v4/latest"
  private static readonly COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3/simple/price"

  static async getFiatRates(baseCurrency = "USD"): Promise<ExchangeRateResponse> {
    const response = await fetch(`${this.EXCHANGE_RATE_BASE_URL}/${baseCurrency}`)

    if (!response.ok) {
      throw new Error(`Ошибка получения курсов валют: ${response.status}`)
    }

    return response.json()
  }

  static async getCryptoRates(
    cryptoIds: string[] = ["bitcoin"],
    vsCurrencies: string[] = ["rub"],
  ): Promise<CoinGeckoResponse> {
    const params = new URLSearchParams({
      ids: cryptoIds.join(","),
      vs_currencies: vsCurrencies.join(","),
      include_24hr_change: "true",
    })

    const response = await fetch(`${this.COINGECKO_BASE_URL}?${params}`)

    if (!response.ok) {
      throw new Error(`Ошибка получения курсов криптовалют: ${response.status}`)
    }

    return response.json()
  }

  static async getAllCurrencies() {
    try {
      const [usdRates, eurRates, cnyRates, cryptoRates] = await Promise.all([
        this.getFiatRates("USD"),
        this.getFiatRates("EUR"),
        this.getFiatRates("CNY"),
        this.getCryptoRates(["bitcoin"], ["rub"]),
      ])

      return {
        usd: usdRates.rates.RUB,
        eur: eurRates.rates.RUB,
        cny: cnyRates.rates.RUB,
        btc: cryptoRates.bitcoin.rub,
        btcChange: cryptoRates.bitcoin.rub_24h_change,
      }
    } catch (error) {
      console.error("Ошибка при получении курсов валют:", error)
      throw error
    }
  }
}
