import React from "react"
import Image from "next/image"
import { Project } from "@/types/pull_requests"

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
                    ? " border-card-text-black border-2"
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

export const ProjectsBlock = ({
    projects,
    toggleFilter,
    handleFilterToggle
}: {
    projects: Array<Project>
    toggleFilter: string | null
    handleFilterToggle: (key: string) => void
}) => {
    const [showMore, setShowMore] = React.useState(false)

    return (
        <section className="flex gap-4 w-full flex-wrap">
            {projects.length > 0 &&
                projects
                    .slice(0, 3)
                    .map((x, idx) => (
                        <OrganisationCard
                            key={`${idx}_${x.login}`}
                            handleClick={handleFilterToggle}
                            login={x.login}
                            avatarUrl={x.avatarUrl}
                            more={false}
                            toggleFilter={toggleFilter}
                        />
                    ))}
            {projects.length > 3 ? (
                <div className="relative">
                    <button
                        className="text-black border border-card-border-color rounded-md bg-card-bg shadow-card-shadow w-max flex items-center justify-center py-[10px] px-4 cursor-pointer tracking-tighter text-sm"
                        onClick={() => setShowMore(!showMore)}
                    >
                        More
                    </button>
                    {showMore ? (
                        <div className="absolute right-2 top-14 flex flex-col gap-3 border-card-border-color border rounded-md shadow-card-shadow w-[250px] pt-3 bg-white">
                            <p className="text-black text-sm font-semibold px-4">
                                projects
                            </p>
                            <div className="flex flex-col gap-1">
                                {projects.slice(3).map((x, idx) => (
                                    <OrganisationCard
                                        key={`${idx}_${x.login}`}
                                        handleClick={handleFilterToggle}
                                        login={x.login}
                                        avatarUrl={x.avatarUrl}
                                        more={true}
                                        toggleFilter={toggleFilter}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </section>
    )
}
