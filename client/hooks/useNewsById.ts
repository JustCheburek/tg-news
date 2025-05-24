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

export function useNewsById(id: string) {
	const [data, setData] = useState<Article | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const fetchArticle = async () => {
			setIsLoading(true)
			try {
				const response = await api.get(`/news/${id}`)
				setData(response.data)
				setError(null)
			} catch (err) {
				//setError(err as Error)

				// Фейковые данные для демонстрации
				const mockArticles = [
					{
						id: 5,
						link: "https://devby.io/news/garvard-bolshe-ne-mozhet-prinimat-inostrannyh-studentov",
						title:
								"Гарвард больше не может принимать иностранных студентов, а уже учащиеся должны перевестись. Беларусы там тоже есть",
						description:
								"Университет объявил о временном прекращении приема иностранных студентов из-за новых федеральных ограничений. Решение затронет тысячи студентов по всему миру, включая граждан Беларуси.",
						created_at: "2025-05-24T01:40:48.592547Z",
					},
					{
						id: 4,
						link: "https://devby.io/news/ceo-airbnb-obyasnil-chem-horosho-nachinat-biznes-kogda-v-ekonomike-vsyo-ploho",
						title: "CEO Airbnb объяснил, чем хорошо начинать бизнес, когда в экономике всё плохо",
						description:
								"Глава компании поделился опытом создания стартапа во время экономического кризиса 2008 года и объяснил, почему сложные времена могут стать лучшим моментом для запуска нового бизнеса.",
						created_at: "2025-05-24T01:40:18.518144Z",
					},
				]

				const article = mockArticles.find((a) => a.id === Number.parseInt(id))
				if (article) {
					setData(article)
				}
			} finally {
				setIsLoading(false)
			}
		}

		if (id) {
			fetchArticle()
		}
	}, [id])

	return { data, isLoading, error }
}
