"use client"

import { useState } from "react"
import { useNews } from "@/hooks/useNews"
import ArticleCard, { ArticleCardSkeleton } from "@/components/molecules/ArticleCard"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function NewsFeed() {
	const [page, setPage] = useState(1)
	const { data, isLoading, error } = useNews(page)

	const loadMore = () => {
		setPage((prev) => prev + 1)
	}

	const refresh = () => {
		setPage(1)
		window.location.reload()
	}

	if (error) {
		return (
				<div className="text-center py-12">
					<h2 className="text-2xl font-bold mb-4">Ошибка загрузки новостей</h2>
					<p className="text-muted-foreground mb-6">Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>
					<Button onClick={refresh} className="rounded-xl">
						<RefreshCw className="h-4 w-4 mr-2" />
						Попробовать снова
					</Button>
				</div>
		)
	}

	return (
			<div className="space-y-8">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Последние новости</h1>
					<Button variant="outline" size="sm" onClick={refresh} className="rounded-xl">
						<RefreshCw className="h-4 w-4 mr-2" />
						Обновить
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{data?.articles && data.articles.length > 0 ? (
							data.articles.map((article) => (
									<ArticleCard
											key={article.id}
											id={article.id}
											title={article.title}
											description={article.description}
											created_at={article.created_at}
											link={article.link}
									/>
							))
					) : isLoading ? (
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
