
import React from 'react'

export default function PujaCardSkeleton() {
    return (
        <div>
            <div className="overflow-hidden rounded-[28px] border border-[#e9dfd1] bg-white shadow-sm">
                <div className="aspect-[2.35/1] animate-pulse bg-[#f2e9dc]" />
                <div className="space-y-4 p-5">
                    <div className="h-6 w-24 animate-pulse rounded-full bg-[#f2e9dc]" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-[#f2e9dc]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#f2e9dc]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#f2e9dc]" />
                </div>
            </div>

        </div>
    )
}
