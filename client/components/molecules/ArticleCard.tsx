import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ExternalLink } from "lucide-react"

interface ArticleCardProps {
  id: number
  title: string
  description: string
  created_at: string
  link: string
}

export default function ArticleCard({ id, title, description, created_at, link }: ArticleCardProps) {
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

  return (
      <Card className="h-full overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-lg group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{getDomain(link)}</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <h3 className="line-clamp-3 text-lg font-bold mb-3 group-hover:text-green-600 transition-colors">{title}</h3>

          <p className="line-clamp-2 text-muted-foreground text-sm mb-4">{description}</p>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(created_at)}</span>
          </div>
        </CardFooter>

        <Link href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
          <span className="sr-only">Читать статью: {title}</span>
        </Link>
      </Card>
  )
}

export function ArticleCardSkeleton() {
  return (
      <Card className="h-full overflow-hidden rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Skeleton className="h-4 w-32" />
        </CardFooter>
      </Card>
  )
}
