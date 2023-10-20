import React from "react"
import Image from "next/image"

type OrganisationCardProps = {
    login: string
    avatarUrl: string
    handleClick: (type: string) => void
    more: boolean
    toggleFilter: string | null
}

export const OrganisationCard = ({
    login,
    avatarUrl,
    handleClick,
    more,
    toggleFilter
}: OrganisationCardProps) => {
    return (
        <div
            className={`border border-card-border-color rounded-md bg-card-bg shadow-card-shadow flex  py-[10px] px-4 cursor-pointer ${
                more
                    ? "w-full items-start justify-start bg-transparent shadow-none py-2 px-2 hover:bg-card-bg"
                    : "w-max rounded-md items-center justify-center"
            }  ${
                toggleFilter === login
                    ? "border-black border-2"
                    : toggleFilter === login && more === true
                    ? "border-black border"
                    : "border-none"
            } `}
            onClick={() => handleClick(login)}
        >
            <section className="flex items-center gap-2">
                <Image
                    src={avatarUrl}
                    alt={`${login}-logo`}
                    height={16}
                    width={16}
                />
                <p className="text-sm font-semibold tracking-tighter lowercase text-card-text-black whitespace-nowrap">
                    @{login}
                </p>
            </section>
        </div>
    )
}
