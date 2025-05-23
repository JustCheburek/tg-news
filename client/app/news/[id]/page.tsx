"use client"

import { useParams } from "next/navigation"
import { useNewsById } from "@/hooks/useNewsById"
import ArticleHeader from "@/components/organisms/ArticleHeader"
import Sidebar from "@/components/organisms/Sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function ArticlePage() {
  const { id } = useParams()
  const { data: article, isLoading, error } = useNewsById(id as string)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3 mb-6" />
            <Skeleton className="h-[300px] w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
          </div>
          <div className="w-full lg:w-80">
            <Sidebar />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ошибка загрузки статьи</h1>
          <p>Не удалось загрузить статью. Пожалуйста, попробуйте позже.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1">
          {article && (
            <>
              <ArticleHeader
                title={article.title}
                lead={article.lead}
                date={article.date}
                readTime={article.readTime}
                image={article.image}
              />
              <div className="prose prose-lg max-w-none mt-8">
                {article.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </article>
        <div className="w-full lg:w-80">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
