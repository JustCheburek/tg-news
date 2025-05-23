import Image from "next/image"
import IconCalendar from "@/components/atoms/IconCalendar"
import { Heading1, Lead } from "@/components/atoms/Typography"

interface ArticleHeaderProps {
  title: string
  lead: string
  date: string
  readTime: number
  image: string
}

export default function ArticleHeader({ title, lead, date, readTime, image }: ArticleHeaderProps) {
  return (
    <header className="space-y-6">
      <Heading1>{title}</Heading1>
      <Lead>{lead}</Lead>
      <IconCalendar date={date} readTime={readTime} />
      <div className="relative aspect-video w-full md:w-[70%] overflow-hidden rounded-2xl">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>
    </header>
  )
}
