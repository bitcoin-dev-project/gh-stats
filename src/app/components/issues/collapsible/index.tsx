import Link from "next/link"
import React from "react"

import { Comment } from "@/types/comments"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons"

const IssueCollapsibleComponent = ({
    issues,
    type
}: {
    issues: Comment[]
    type: "own" | "others" | "long"
}) => {
    const [open, setOpen] = React.useState(false)

    if (!issues.length) {
        return null
    }

    return (
        <Collapsible.Root
            className="w-[100%]"
            open={open}
            onOpenChange={setOpen}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <span className="text-violet11 text-[15px] leading-[25px] pr-4 text-black dark:text-white">
                    {type === "long"
                        ? `${issues.length} long comments on issues/PR`
                        : `${issues.length} comments on ${type} issues/PR`}
                </span>
                <Collapsible.Trigger asChild>
                    <button className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet-500 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet-200 hover:bg-violet-200 focus:shadow-[0_0_0_2px] focus:shadow-black">
                        {open ? <Cross2Icon /> : <RowSpacingIcon />}
                    </button>
                </Collapsible.Trigger>
            </div>

            <Collapsible.Content>
                {issues.map((issue, index) => {
                    return (
                        <div key={`${index}-${issue.url}`}>
                            <div
                                key={index}
                                className="bg-slate-200 text-start rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-slate-400"
                            >
                                <Link
                                    href={issue.url}
                                    target="_blank"
                                    className=" text-blue-600 underline flex flex-wrap text-left justify-start items-start w-full"
                                >
                                    {issue.url}
                                </Link>
                                <p className="text-violet-600 text-[15px] leading-[25px]">
                                    {issue.body}
                                </p>
                                <code className="text-violet-500 text-[13px] leading-[25px]">
                                    Opened on:{" "}
                                    {new Date(issue.createdAt).toDateString()}
                                </code>
                                <Link
                                    href={issue.url}
                                    target="_blank"
                                    className=" text-violet-500 text-[13px] hover:underline flex flex-wrap text-left justify-start items-start w-full"
                                >
                                    repo: {issue.repository}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

export default IssueCollapsibleComponent
