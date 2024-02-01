import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonPreviewCard() {
  return (
    <div className="flex flex-col justify-around space-y-3 w-full h-full p-5">
      <Skeleton className="w-full rounded-xl aspect-square" />
      <div className="space-y-2  w-fullflex flex-col justify-center">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
