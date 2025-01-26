import { Skeleton } from "@/components/ui/skeleton";

export default function LatestArticleLoading() {
  return (
    <div className="relative h-[560px] w-full max-w-4xl mx-auto my-16">
      <article className="absolute w-full bg-white shadow-xl border border-black overflow-hidden h-[500px]">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 z-40 px-4">
          <Skeleton className="h-10 w-10 rounded-full bg-[#a1a1a1]" />
          <Skeleton className="h-10 w-10 rounded-full bg-[#a1a1a1]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 h-full">
          <div className="col-span-6 h-full relative">
            <Skeleton className="w-full h-full bg-[#a1a1a1]" />
          </div>

          <div className="col-span-5 flex flex-col h-full px-2 py-6">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-x-2 md:space-x-4">
                  <Skeleton className="h-6 w-16 inline-block bg-[#a1a1a1]" />
                  <Skeleton className="h-6 w-16 inline-block bg-[#a1a1a1]" />
                </div>

                <Skeleton className="h-10 lg:h-12 w-3/4 bg-[#a1a1a1] mt-6" />

                <Skeleton className="h-6 w-full bg-[#a1a1a1] mt-4" />
                <Skeleton className="h-6 w-5/6 bg-[#a1a1a1]" />
                <Skeleton className="h-6 w-3/4 bg-[#a1a1a1]" />
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm my-6">
                  <Skeleton className="h-6 w-32 bg-[#a1a1a1]" />
                  <span>•</span>
                  <Skeleton className="h-6 w-24 bg-[#a1a1a1]" />
                </div>

                <Skeleton className="h-8 w-32 bg-[#a1a1a1]" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}