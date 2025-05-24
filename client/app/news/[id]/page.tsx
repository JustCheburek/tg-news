"use client"

import { useParams } from "next/navigation"
import { useNewsById } from "@/hooks/useNewsById"
import Sidebar from "@/components/organisms/Sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ArticlePage() {
	const { id } = useParams()
	const { data: article, isLoading, error } = useNewsById(id as string)

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const getDomain = (url: string) => {
		try {
			return new URL(url).hostname.replace("www.", "")
		} catch {
			return "Источник"
		}
	}

	if (isLoading) {
		return (
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col lg:flex-row gap-8">
						<div className="flex-1">
							<Skeleton className="h-8 w-32 mb-6" />
							<Skeleton className="h-12 w-3/4 mb-4" />
							<Skeleton className="h-6 w-full mb-2" />
							<Skeleton className="h-6 w-2/3 mb-6" />
							<Skeleton className="h-10 w-48 mb-6" />
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-3/4" />
						</div>
						<div className="w-full lg:w-80">
							<Sidebar />
						</div>
					</div>
				</div>
		)
	}

	if (error || !article) {
		return (
				<div className="container mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
						<p className="text-muted-foreground mb-6">Запрашиваемая статья не существует или была удалена.</p>
						<Link href="/">
							<Button className="rounded-xl">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Вернуться на главную
							</Button>
						</Link>
					</div>
				</div>
		)
	}

	return (

			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					<article className="flex-1">
						<div className="mb-6">
							<Link href="/">
								<Button variant="ghost" size="sm" className="mb-4 rounded-xl">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Назад к новостям
								</Button>
							</Link>
						</div>

						<header className="space-y-6 mb-8">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="bg-muted px-2 py-1 rounded-md">{getDomain(article.link)}</span>
								<span>•</span>
								<div className="flex items-center">
									<Calendar className="h-4 w-4 mr-1" />
									{formatDate(article.created_at)}
								</div>
							</div>

							<h1 className="text-3xl font-bold leading-tight md:text-4xl">{article.title}</h1>

							<p className="text-xl text-muted-foreground leading-relaxed">{article.description}</p>

							<div className="pt-4">
								<Button asChild className="rounded-xl">
									<a href={article.link} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="h-4 w-4 mr-2" />
										Читать полную статью
									</a>
								</Button>
							</div>
						</header>
					</article>

					<div className="w-full lg:w-80">
						<Sidebar />
					</div>
				</div>
			</div>
	)
}
