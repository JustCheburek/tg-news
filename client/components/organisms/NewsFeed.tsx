"use client"

import { useState, useEffect } from "react"
import { useNews } from "@/hooks/useNews"
import ArticleCard, { ArticleCardSkeleton } from "@/components/molecules/ArticleCard"
import { Button } from "@/components/ui/button"

export default function NewsFeed() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useNews(page)
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    if (data?.articles) {
      setArticles((prev) => [...prev, ...data.articles])
    }
  }, [data])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ошибка загрузки новостей</h2>
        <p className="text-muted-foreground mb-6">Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>
        <Button onClick={() => setPage(1)}>Попробовать снова</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Новости экономики</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              lead={article.lead}
              date={article.date}
              readTime={article.readTime}
              image={article.image}
            />
          ))
        ) : isLoading ? (
          // Показываем скелетоны при первой загрузке
          Array.from({ length: 6 }).map((_, index) => <ArticleCardSkeleton key={index} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Новости не найдены</p>
          </div>
        )}
      </div>

      {data?.hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} disabled={isLoading} className="rounded-xl">
            {isLoading ? "Загрузка..." : "Загрузить еще"}
          </Button>
        </div>
      )}
    </div>
  )
}
