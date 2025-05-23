"use client"

import {useEffect, useState} from "react"
import {api} from "@/lib/api"

interface Article {
	id: string
	title: string
	lead: string
	content: string
	date: string
	readTime: number
	image: string
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
				setError(err as Error)
			} finally {
				setIsLoading(false)
			}
		}

		if (id) {
			fetchArticle()
		}
	}, [id])

	return {data, isLoading, error}
}
