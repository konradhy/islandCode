import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function Content() {
  return (
    <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-8">IslandCode</h1>
          <div className="relative mb-4">
            <Input 
              type="text" 
              placeholder="Search Caribbean legal cases and precedents" 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="default">Search</Button>
            <Button variant="outline">Advanced</Button>
          </div>
        </div>
      </main>
  )
}