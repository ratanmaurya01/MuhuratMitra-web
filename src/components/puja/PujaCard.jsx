import React from 'react'
import Link from "next/link";
import {
    Clock3,
    IndianRupee,
    Flower2,
} from "lucide-react";


export default function PujaCard({ puja }) {

    const image =
        puja.image ||
        puja.imageUrl ||
        puja.bannerImage ||
        puja.thumbnail;

    const category =
        puja.categoryName ||
        puja.category ||
        "Traditional";

    const deity =
        puja.deity ||
        puja.deityName ||
        puja.god ||
        "Hindu Deity";

    const displayName = puja.nameHindi || puja.name || "Puja";

    const showSecondaryName =
        puja.name &&
        puja.nameHindi &&
        puja.name !== puja.nameHindi;


    return (
        <div>

            <Link
                href={`/pujas/${puja.id}`}
                className="group block h-full overflow-hidden rounded-[28px] border border-[#e8ddce] bg-white shadow-[0_3px_8px_rgba(76,48,30,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
                {/* Puja Image */}


                {/* Puja Image */}
                <div className="relative h-[190px] w-full overflow-hidden bg-[#f4e8d5] sm:h-[210px]">
                    {image ? (
                        <img
                            src={image}
                            alt={displayName}
                            className="block h-full w-full object-cover object-center"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f8e6c9] to-[#edc99c] text-[#9c512d]">
                            <Flower2 size={55} strokeWidth={1.2} />
                        </div>
                    )}
                </div>
                
                {/* Puja Information */}
                <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#ffeadb] px-4 py-1.5 text-xs font-medium text-[#8b452c] sm:text-sm">
                            {category}
                        </span>

                        <span className="flex shrink-0 items-center gap-0.5 text-lg font-semibold text-[#702c27] sm:text-xl">
                            <IndianRupee size={18} />
                            {Number(puja.price || 0).toLocaleString("en-IN")}
                        </span>
                    </div>

                    <h2 className="mt-4 text-xl font-medium leading-snug text-[#35251f] sm:text-2xl">
                        {displayName}
                    </h2>

                    {showSecondaryName && (
                        <p className="mt-1 text-sm text-[#806d61]">
                            {puja.name}
                        </p>
                    )}

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#806d61] sm:text-base">
                        {puja.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#806d61]">
                        <Clock3
                            size={17}
                            className="shrink-0 text-[#c85c32]"
                        />

                        <span>{puja.durationMin || "--"} mins</span>
                        <span>•</span>
                        <span>{deity}</span>
                    </div>

                    {/* View Details */}
                    <div className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#f36b0b] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[#d95a05]">
                        View Details
                    </div>
                </div>
            </Link>

        </div>
    )
}
