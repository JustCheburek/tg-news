import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Добавляем интерцептор для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === "ECONNABORTED") {
        console.error("Превышено время ожидания запроса")
      } else if (error.response) {
        console.error(`Ошибка API: ${error.response.status}`, error.response.data)
      } else if (error.request) {
        console.error("Нет ответа от сервера")
      } else {
        console.error("Ошибка настройки запроса:", error.message)
      }
      return Promise.reject(error)
    },
)

// Добавляем интерцептор для логирования запросов в development
if (process.env.NODE_ENV === "development") {
  api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error("Request error:", error)
        return Promise.reject(error)
      },
  )
}
