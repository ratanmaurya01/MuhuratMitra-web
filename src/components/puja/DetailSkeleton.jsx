
import React from 'react'

export default function DetailSkeleton() {
  return (
    <div>
       <div className="mx-auto max-w-5xl animate-pulse px-5 py-10 lg:px-8">
            <div className="mb-8 h-5 w-28 rounded bg-muted" />
            <div className="mb-4 h-9 w-2/3 rounded bg-muted" />
            <div className="mb-8 h-5 w-full max-w-2xl rounded bg-muted" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 rounded-2xl bg-muted" />
              <div className="h-64 rounded-2xl bg-muted" />
            </div>
          </div>
    </div>
  )
}
