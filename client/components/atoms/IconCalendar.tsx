import { Calendar, Clock } from "lucide-react"

interface IconCalendarProps {
  date: string
  readTime?: number
  className?: string
}

export default function IconCalendar({ date, readTime, className }: IconCalendarProps) {
  return (
    <div className={`flex items-center text-sm text-muted-foreground ${className}`}>
      <Calendar className="h-4 w-4 mr-1" />
      <span>{date}</span>
      {readTime && (
        <>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{readTime} мин чтения</span>
        </>
      )}
    </div>
  )
}
