import Link from "next/link"
import React from "react"

import { PR } from "@/types/pull_requests"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons"

const PullRequestCollapsibleComponent = ({
    pullRequests,
    type
}: {
    pullRequests: PR[]
    type: "merged" | "open" | "inactive" | "closed" | "closed by others"
}) => {
    const [open, setOpen] = React.useState(false)

    if (!pullRequests.length) {
        return null
    }

    return (
        <Collapsible.Root
            className="w-[full]"
            open={open}
            onOpenChange={setOpen}
        >
            <div className="flex items-center justify-between">
                <span className="text-violet11 text-[15px] leading-[25px] pr-4 text-black dark:text-white">
                    {`${pullRequests.length} `}
                    {type === "closed by others"
                        ? "pull requests closed by others"
                        : `${type} pull requests`}
                </span>
                <Collapsible.Trigger asChild>
                    <button className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet-500 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet-200 hover:bg-violet-200 focus:shadow-[0_0_0_2px] focus:shadow-black">
                        {open ? <Cross2Icon /> : <RowSpacingIcon />}
                    </button>
                </Collapsible.Trigger>
            </div>

            <Collapsible.Content>
                {pullRequests.map((pullRequest, index) => {
                    return (
                        <div key={`${index}-${pullRequest.url}`}>
                            <div
                                key={index}
                                className="bg-slate-200 text-start rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-slate-400"
                            >
                                <Link
                                    href={pullRequest.url}
                                    target="_blank"
                                    className=" text-blue-600 underline flex flex-wrap text-left justify-start items-start w-full"
                                >
                                    {pullRequest.url}
                                </Link>
                                <p className="text-violet-600 text-[15px] leading-[25px]">
                                    {pullRequest.title}
                                </p>
                                <p>
                                    <code className="text-violet-500 text-[13px] leading-[25px]">
                                        {`${
                                            pullRequest.totalComments
                                        }                                            ${
                                            pullRequest.totalComments === 1
                                                ? "comment"
                                                : "comments"
                                        }`}
                                    </code>
                                </p>
                                <p>
                                    <code className="text-violet-500 text-[13px] leading-[25px]">
                                        Opened for: {pullRequest.daysOpened}{" "}
                                        days
                                    </code>
                                </p>
                                <p>
                                    <code className="text-violet-500 text-[13px] leading-[25px]">
                                        Opened on:{" "}
                                        {new Date(
                                            pullRequest.createdAt
                                        ).toDateString()}
                                    </code>
                                </p>
                                <Link
                                    href={pullRequest.repoUrl}
                                    target="_blank"
                                    className=" text-violet-500 text-[13px] hover:underline flex flex-wrap text-left justify-start items-start w-full"
                                >
                                    repo: {pullRequest.repoUrl}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

export default PullRequestCollapsibleComponent
