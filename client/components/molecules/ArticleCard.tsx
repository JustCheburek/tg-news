import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import IconCalendar from "@/components/atoms/IconCalendar"
import { Skeleton } from "@/components/ui/skeleton"

interface ArticleCardProps {
  id: string
  title: string
  lead: string
  date: string
  readTime: number
  image: string
}

export default function ArticleCard({ id, title, lead, date, readTime, image }: ArticleCardProps) {
  return (
    <Link href={`/news/${id}`}>
      <Card className="h-full overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-lg">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-xl font-bold">{title}</h3>
          <p className="mt-2 line-clamp-3 text-muted-foreground">{lead}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <IconCalendar date={date} readTime={readTime} />
        </CardFooter>
      </Card>
    </Link>
  )
}

export function ArticleCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-2xl">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-2/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  )
}
