"use client"

import { useSearchParams } from "next/navigation"
import React, { useState } from "react"
import { OrganisationCard } from "../components/cards/OrganisationCard"

import YearSection from "../components/years-switch"
import { useGithubIssues } from "@/hooks/useGithubIssues"
import { IssuesAndPullRequests } from "../components/issues-and-prs"
import Skeleton from "../components/skeleton"

const Page = () => {
    const searchParams = useSearchParams()
    const username = searchParams.get("username")
    const [showMore, setShowMore] = useState(false)
    const {
        handleFilterToggle,
        memoizedIssues,
        memoizedPrs,
        loading,
        error,
        projects,
        toggleFilter
    } = useGithubIssues()

    const [currentYear, setCurrentYear] = useState("2023")
    const dummyYears = ["2023", "2022", "2021", "2020"]

    return (
        <main className="flex items-center justify-center">
            <div
                className="h-screen max-w-5xl grid justify-center w-full"
                style={{ gridTemplateColumns: "3fr 1fr" }}
            >
                <div className="w-full flex flex-col border-2 p-9 pt-0 pb-2 gap-6 h-screen">
                    <section className="max-h-[201px] flex flex-col gap-4 pt-9">
                        <div className="flex justify-between items-center">
                            <h2 className=" text-black capitalize">
                                {username} {currentYear} contributions
                            </h2>
                            <section className="">
                                <button className="text-xs leading-[18px] px-2 py-[5px] font-semibold text-card-text-black border-2 border-border-blue rounded-l-[6px]">
                                    Commits
                                </button>
                                <button className="text-xs leading-[18px] px-2 py-[5px] font-semibold text-card-text-black border-2 border-border-blue rounded-r-[6px]">
                                    Discussion
                                </button>
                            </section>
                        </div>
                        <div className="outline h-[82px] outline-black"></div>
                    </section>
                    <section className="flex gap-4 w-full">
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
                                                    handleClick={
                                                        handleFilterToggle
                                                    }
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

                    <section className="overflow-hidden overflow-y-scroll max-w-[692px]">
                        {loading ? (
                            <div className="flex items-center justify-center flex-col gap-4">
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </div>
                        ) : (
                            <IssuesAndPullRequests
                                issues={memoizedIssues}
                                prs={memoizedPrs}
                                username={username!}
                            />
                        )}
                    </section>
                </div>
                <div className="w-full p-6 py-8 h-max rounded-[15px]">
                    <YearSection
                        years={dummyYears}
                        data={undefined}
                        currentYear={"2023"}
                        setCurrentYear={setCurrentYear}
                    />
                </div>
            </div>
        </main>
    )
}

export default Page
