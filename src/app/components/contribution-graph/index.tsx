import { days, months } from "@/helpers/utils"
import { Contribution } from "@/types"
import React from "react"
import ToolTip from "../tool-tip"

const ContributionGraph = ({
    memoizedGraphValues,
    loading,
    onClickToolTip
}: {
    memoizedGraphValues: Contribution[]
    onClickToolTip: (content: Contribution) => void
    loading: boolean
}) => {
    return (
        <div>
            <div className="flex items-center gap-[3px]">
                <section className="flex flex-col justify-center h-full mt-[10px]">
                    {days.map((d) => (
                        <p key={d} className="text-black text-xs pt-[8.5px]">
                            {d}
                        </p>
                    ))}
                </section>
                <div className="max-w-full w-full overflow-x-auto h-full relative">
                    <section className="grid grid-flow-col pb-[2px] w-full overflow-x-auto md:min-w-[620px] min-w-[620px]">
                        {months.map((m) => (
                            <p key={m} className="text-black text-xs">
                                {m}
                            </p>
                        ))}
                    </section>
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
        </div>
    )
}

export default ContributionGraph
