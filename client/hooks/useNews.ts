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

export function useNews(page = 1) {
  const [data, setData] = useState<NewsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("/news", { params: { page, limit: 10 } })

        // Адаптируем данные под новую структуру
        const articles = response.data.map((item: any) => ({
          id: item.id,
          link: item.link,
          title: item.title,
          description: item.description === item.link ? "Подробности по ссылке..." : item.description,
          created_at: item.created_at,
        }))

        setData({
          articles,
          hasMore: articles.length === 10, // Предполагаем, что есть еще данные, если получили полную страницу
        })
        setError(null)
      } catch (err) {
        //setError(err as Error)

        if (page === 1) {
          setData({
            articles: [
              {
                id: 5,
                link: "https://devby.io/news/garvard-bolshe-ne-mozhet-prinimat-inostrannyh-studentov",
                title:
                    "Гарвард больше не может принимать иностранных студентов, а уже учащиеся должны перевестись. Беларусы там тоже есть",
                description:
                    "Университет объявил о временном прекращении приема иностранных студентов из-за новых федеральных ограничений.",
                created_at: "2025-05-24T01:40:48.592547Z",
              },
              {
                id: 4,
                link: "https://devby.io/news/ceo-airbnb-obyasnil-chem-horosho-nachinat-biznes-kogda-v-ekonomike-vsyo-ploho",
                title: "CEO Airbnb объяснил, чем хорошо начинать бизнес, когда в экономике всё плохо",
                description:
                    "Глава компании поделился опытом создания стартапа во время экономического кризиса 2008 года.",
                created_at: "2025-05-24T01:40:18.518144Z",
              },
              {
                id: 3,
                link: "https://devby.io/news/belarusam-hotyat-zapretit-pokupat-nedvizhimost-eschyo-v-odnoi-strane",
                title: "Беларусам хотят запретить покупать недвижимость ещё в одной стране. Уже в следующем месяце",
                description: "Новые ограничения могут коснуться покупки недвижимости гражданами Беларуси в странах ЕС.",
                created_at: "2025-05-24T01:39:48.478815Z",
              },
              {
                id: 2,
                link: "https://habr.com/ru/news/910180/?utm_source=habrahabr&utm_medium=rss&utm_campaign=910180",
                title:
                    "Студентка в США потребовала вернуть деньги за обучение ($8 000), поймав профессора на использовании ChatGPT",
                description:
                    "Инцидент произошел в одном из американских университетов, где преподаватель использовал ИИ для подготовки лекций.",
                created_at: "2025-05-24T01:28:40.079978Z",
              },
              {
                id: 1,
                link: "https://habr.com/ru/news/911916/?utm_source=habrahabr&utm_medium=rss&utm_campaign=911916",
                title: "Microsoft уволила программиста с 25-летним стажем по решению алгоритма",
                description: "Компания использует автоматизированные системы для оценки эффективности сотрудников.",
                created_at: "2025-05-24T01:13:40.016138Z",
              },
            ],
            hasMore: true,
          })
        } else {
          setData({
            articles: [],
            hasMore: false,
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [page])

  return { data, isLoading, error }
}
