"use client"

import { useSearchParams } from "next/navigation"
import React from "react"
import { ProjectsBlock } from "../components/cards/OrganisationCard"

import YearSection from "../components/years-switch"
import { useGithubIssues } from "@/hooks/useGithubIssues"
import { IssuesAndPullRequests } from "../components/issues-and-prs"
import "../globals.css"
import ToolTip from "../components/tool-tip"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

const Page = () => {
    const searchParams = useSearchParams()
    const username = searchParams.get("username")
    const {
        handleFilterToggle,
        memoizedIssues,
        memoizedPrs,
        loading,
        projects,
        toggleFilter,
        yearlyFilter,
        handleYearlyFilter,
        years,
        memoizedGraphValues,
        onClickToolTip,
        goBack
    } = useGithubIssues()

    return (
        <main className="flex items-center justify-center bg-white">
            <div
                className="sm:h-screen h-full max-w-5xl flex flex-col-reverse w-full md:grid sm:justify-center"
                style={{ gridTemplateColumns: "3fr 1fr" }}
            >
                <div className="w-full flex flex-col sm:border-2 md:p-8 md:pt-0 sm:pb-2 p-4 pt-0 gap-6 h-screen overflow-x-scroll">
                    <section className="flex flex-col gap-4 pt-9">
                        <button>
                            <ArrowLeftIcon
                                color="black"
                                onClick={goBack}
                                cursor="pointer"
                                height="20px"
                                width="20px"
                                className="arrowLeftIcon"
                            />
                        </button>
                        <div className="flex gap-2 flex-col md:justify-between md:items-center  md:flex-row">
                            <h2 className=" text-black capitalize">
                                {username} contributions
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
                        <div className="max-w-full w-full overflow-x-auto">
                            <div className="gap-[2px] grid grid-flow-col h-full gridBox">
                                {memoizedGraphValues.map((day, idx) => (
                                    <ToolTip
                                        key={`${day.day}_${idx}`}
                                        content={day}
                                        onClickToolTip={onClickToolTip}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        </div>
                        <section className="text-black text-xs font-medium flex gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                                <p>Commits</p>
                                <section className="h-[10px] w-[10px] rounded-[3px] bg-grid-blue"></section>
                            </div>
                            <div className="flex items-center gap-1">
                                <p>Comments</p>
                                <section className="h-[10px] w-[10px] rounded-[3px] bg-grid-yellow"></section>
                            </div>
                            <div className="flex items-center gap-1">
                                <p>Commits & Comments</p>
                                <section className="h-[10px] w-[10px] rounded-[3px] bg-grid-green"></section>
                            </div>
                        </section>
                    </section>
                    <ProjectsBlock
                        projects={projects}
                        toggleFilter={toggleFilter}
                        handleFilterToggle={handleFilterToggle}
                    />
                    <IssuesAndPullRequests
                        issues={memoizedIssues}
                        prs={memoizedPrs}
                        username={username!}
                        loading={loading}
                    />
                </div>
                <YearSection
                    years={years}
                    currentYear={yearlyFilter}
                    handleClick={handleYearlyFilter}
                />
            </div>
        </main>
    )
}

export default Page
