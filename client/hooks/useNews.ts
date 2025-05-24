"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface Article {

  id: number
  link: string
  title: string
  description: string
  created_at: string
}

interface NewsResponse {
  articles: Article[]
  hasMore: boolean
}

export function useNews(page: number) {
  const [data, setData] = useState<NewsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("/news", { params: { page } })
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [page])

  return { data, isLoading, error }
}
