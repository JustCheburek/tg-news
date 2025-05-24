import NewsFeed from "@/components/organisms/NewsFeed"
import Sidebar from "@/components/organisms/Sidebar"

export default function Home() {
	return (
			<>
				<div className="flex-1">
					<NewsFeed/>
				</div>
				<div className="w-full lg:w-80">
					<Sidebar/>
				</div>
			</>
	)
}
