import { Skeleton } from "@/components/ui/skeleton";

export default function MasonryArticleLoading() {
  return (
    <div>
      <div className="columns-2 md:columns-3 gap-4 space-y-4 mt-12 md:mt-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <article 
            key={index}
            className="break-inside-avoid-column bg-white border border-black"
          >
            <div className="relative w-full pt-[50%]">
              <Skeleton className="absolute inset-0 w-full h-full" />
            </div>
            <div className="p-6">
              <Skeleton className="h-6 w-24 mb-4 bg-[#a1a1a1]" />
              <Skeleton className="h-8 w-full mb-3 bg-[#a1a1a1]" />
              <Skeleton className="h-6 w-5/6 mb-4 bg-[#a1a1a1]" />
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <Skeleton className="h-4 w-24 bg-[#a1a1a1]" />
                <span>•</span>
                <Skeleton className="h-4 w-20 bg-[#a1a1a1]" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Separator */}
      <div className="w-full h-px bg-black my-8" />

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <Skeleton className="h-10 w-24 bg-[#a1a1a1]" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-10 bg-[#a1a1a1]" />
        ))}
        <Skeleton className="h-10 w-24 bg-[#a1a1a1]" />
      </div>
    </div>
  )
}