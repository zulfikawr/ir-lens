import { Skeleton } from "@/components/ui/skeleton";

export default function RegionalFocusLoading() {
  return (
    <section className="my-16">
      {/* Section Header Skeleton */}
      <div className="border-t border-black py-6 mt-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 bg-[#a1a1a1]" />
            <Skeleton className="h-8 w-48 bg-[#a1a1a1]" />
          </div>
          {/* Region Tabs Skeleton */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="px-4 py-2 h-10 w-28 bg-[#a1a1a1]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Featured Article Skeleton */}
        <div className="col-span-12 lg:col-span-8 border border-black">
          <div className="relative h-[400px]">
            <Skeleton className="absolute inset-0 w-full h-full bg-[#a1a1a1]" />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24 bg-[#a1a1a1]" />
              <Skeleton className="h-4 w-16 bg-[#a1a1a1]" />
            </div>
            <Skeleton className="h-6 w-full mb-3 bg-[#a1a1a1]" />
            <Skeleton className="h-4 w-5/6 bg-[#a1a1a1]" />
          </div>
        </div>

        {/* Side Articles Skeleton */}
        <div className="col-span-12 lg:col-span-4 border border-black divide-y divide-black">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between text-xs mb-2">
                <Skeleton className="h-4 w-24 bg-[#a1a1a1]" />
                <Skeleton className="h-4 w-16 bg-[#a1a1a1]" />
              </div>
              <Skeleton className="h-6 w-full mb-2 bg-[#a1a1a1]" />
              <Skeleton className="h-4 w-5/6 bg-[#a1a1a1]" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <Skeleton className="h-10 w-24 bg-[#a1a1a1]" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-10 w-10 bg-[#a1a1a1]"
          />
        ))}
        <Skeleton className="h-10 w-24 bg-[#a1a1a1]" />
      </div>
    </section>
  );
}