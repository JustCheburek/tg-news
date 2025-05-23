import NewsFeed from "@/components/organisms/NewsFeed"
import Sidebar from "@/components/organisms/Sidebar"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <NewsFeed />
        </div>
        <div className="w-full lg:w-80">
          <Sidebar />
        </div>
      </div>
    </main>
  )
}
