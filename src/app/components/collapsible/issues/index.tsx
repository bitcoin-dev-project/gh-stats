import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Comment } from "@/types/comments"
import CloseIcon from "../../../assets/svgs/close.svg"
import ExpandIcon from "../../../assets/svgs/expand.svg"
import * as Collapsible from "@radix-ui/react-collapsible"
import Checkmark from "../../../assets/svgs/checkmark.svg"
import CommentIcon from "../../../assets/svgs/message.svg"
import {
    collapsibleHeader,
    contentHeading,
    getIssueNumber
} from "@/helpers/utils"

type CollapsibleIssueProps = {
    issues: Comment[]
    type: "own" | "others" | "long"
    username: string
}

const CollaspsibleIssue = ({
    issues,
    type,
    username
}: CollapsibleIssueProps) => {
    const [open, setOpen] = useState(false)

    if (!issues.length) {
        return null
    }

    return (
        <div className="">
            <Collapsible.Root
                className="w-[100%]"
                open={open}
                onOpenChange={setOpen}
            >
                <Collapsible.Trigger asChild>
                    <button
                        className={`flex gap-1 items-center text-sm text-card-secondary-blue underline ${
                            open ? "font-bold" : "font-normal"
                        }`}
                    >
                        {contentHeading(issues, type)}
                        {open ? (
                            <Image
                                src={ExpandIcon}
                                alt="expand icon"
                                height={16}
                                width={16}
                            />
                        ) : (
                            <Image
                                src={CloseIcon}
                                alt="close icon"
                                height={16}
                                width={16}
                            />
                        )}
                    </button>
                </Collapsible.Trigger>

                <Collapsible.Content>
                    {issues.map((issue, index) => {
                        return (
                            <div key={`${index}-${issue.url}`}>
                                <div
                                    key={index}
                                    className="text-start rounded flex gap-2 flex-col items-start p-3 border border-comment-card-border my-4"
                                >
                                    <p className="text-xs font-semibold text-card-comment-card-black">
                                        {username}/
                                        {collapsibleHeader(issue.url, username)}
                                    </p>
                                    <section className="flex items-center gap-1">
                                        <Image
                                            src={Checkmark}
                                            alt="check mark icon"
                                            height={16}
                                            width={16}
                                        />
                                        <Link
                                            href={issue.url}
                                            target="_blank"
                                            className="text-sm text-card-secondary-blue flex flex-wrap text-left justify-start items-start w-full tracking-tight"
                                        >
                                            {issue.url}
                                        </Link>
                                    </section>
                                    <p className="text-sm  text-black">
                                        {issue.body}
                                    </p>

                                    <div className="flex flex-row w-full gap-3 items-center text-xs text-black">
                                        <section className="flex items-center w-max gap-2">
                                            <Image
                                                src={
                                                    issue.issue.author.avatarUrl
                                                }
                                                alt="avatar"
                                                height={16}
                                                width={16}
                                                className="rounded-[50%]"
                                            />
                                            <p>{issue.issue.author.login}</p>
                                        </section>
                                        <span>•</span>
                                        <section className="flex items-center w-max gap-2">
                                            <Image
                                                src={CommentIcon}
                                                alt="comment icon"
                                                height={16}
                                                width={16}
                                            />
                                            <p className="text-xs text-black lowercase">
                                                {
                                                    issue.issue.comments
                                                        .totalCount
                                                }
                                            </p>
                                        </section>
                                        <span>•</span>
                                        <p className="text-[13px] whitespace-nowrap">
                                            Opened on:
                                            {new Date(
                                                issue.createdAt
                                            ).toDateString()}
                                        </p>
                                        <span>•</span>
                                        <p className=" text-[13px]">
                                            #{getIssueNumber(issue.url)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    )
}

export default CollaspsibleIssue
