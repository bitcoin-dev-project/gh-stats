import React from "react"
import Image from "next/image"
import { Project } from "@/types/pull_requests"

type OrganisationCardProps = {
    login: string
    avatarUrl: string
    handleClick: (type: string) => void
    toggleFilter: string | null
}

export const OrganisationCard = ({
    login,
    avatarUrl,
    handleClick,
    toggleFilter
}: OrganisationCardProps) => {
    return (
        <div
            className={`border border-card-border-color rounded-md bg-card-bg shadow-card-shadow flex py-[8px] sm:py-[10px] px-4 cursor-pointer ${
                toggleFilter === login
                    ? " border-card-text-black border-2"
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
                <p className="text-xs sm:text-sm font-semibold tracking-tighter lowercase text-card-text-black whitespace-nowrap">
                    @{login}
                </p>
            </section>
        </div>
    )
}

export const ProjectsBlock = ({
    projects,
    toggleFilter,
    handleFilterToggle
}: {
    projects: Array<Project & { position: number }>
    toggleFilter: string | null
    handleFilterToggle: (key: string) => void
}) => {
    return (
        <section className="flex gap-4 w-full flex-wrap">
            {projects.length > 0 &&
                projects.map((x, idx) => (
                    <OrganisationCard
                        key={`${idx}_${x.login}`}
                        handleClick={handleFilterToggle}
                        login={x.login}
                        avatarUrl={x.avatarUrl}
                        toggleFilter={toggleFilter}
                    />
                ))}
        </section>
    )
}
