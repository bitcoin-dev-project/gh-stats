import { days, months } from "@/helpers/utils"
import { Contribution } from "@/types"
import { IssueCommentNodes } from "@/types/comments"
import { PrNodes } from "@/types/pull_requests"
import React from "react"
import ToolTip from "../tool-tip"

const ContributionGraph = ({
    memoizedGraphValues,
    loading,
    onClickToolTip,
    allPrs,
    allIssues,
    username
}: {
    memoizedGraphValues: Contribution[]
    onClickToolTip: (content: Contribution) => void
    loading: boolean
    allPrs: PrNodes[]
    allIssues: IssueCommentNodes[]
    username: string
}) => {
    const condition = allPrs.length === 0 && allIssues.length === 0

    return (
        <div
            className={`${
                condition && loading === false ? "relative border rounded" : ""
            } `}
        >
            {condition && loading === false ? (
                <section className="h-full w-full flex items-center justify-center absolute z-50 bg-slate-50 opacity-70">
                    <p className="text-black font-semibold text-sm opacity-100">
                        <span className="text-black capitalize">
                            {username}
                        </span>{" "}
                        may have mostly private contributions
                    </p>
                </section>
            ) : null}
            <>
                <div className="flex items-center gap-[3px]">
                    {condition ? null : (
                        <section className="flex flex-col justify-center h-full mt-[10px]">
                            {days.map((d) => (
                                <p
                                    key={d}
                                    className="text-black text-xs pt-[8.5px]"
                                >
                                    {d}
                                </p>
                            ))}
                        </section>
                    )}
                    <div className="max-w-full w-full overflow-x-auto h-full relative">
                        {allPrs.length === 0 &&
                        allIssues.length === 0 ? null : (
                            <section className="grid grid-flow-col pb-[2px] w-full overflow-x-auto md:min-w-[620px] min-w-[620px]">
                                {months.map((m) => (
                                    <p key={m} className="text-black text-xs">
                                        {m}
                                    </p>
                                ))}
                            </section>
                        )}
                        <div>
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
                    </div>
                </div>
                {condition ? null : (
                    <section className="text-black text-xs font-medium flex gap-3 flex-wrap pt-4">
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
                )}
            </>
        </div>
    )
}

export default ContributionGraph
