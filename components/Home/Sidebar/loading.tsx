import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarLoading() {
  return (
    <div>
      <div className="sticky top-8">
        {/* Quick Headlines Skeleton */}
        <div className="p-6 mb-8 border-l border-black shadow-sm">
          <Skeleton className="h-8 w-48 bg-[#a1a1a1]" />
          <div className="w-full h-px bg-black mt-4 mb-8" />
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 bg-[#a1a1a1]" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-full mb-2 bg-[#a1a1a1]" />
                  <Skeleton className="h-4 w-24 bg-[#a1a1a1]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Skeleton */}
        <div className="bg-black p-6">
          <Skeleton className="h-8 w-24 mb-4 bg-[#a1a1a1]" />
          <div className="w-full h-px bg-white mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 bg-[#a1a1a1]" />
                <Skeleton className="h-6 w-12 bg-[#a1a1a1]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}