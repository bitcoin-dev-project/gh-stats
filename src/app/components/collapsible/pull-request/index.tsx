import React from "react"
import Link from "next/link"
import Image from "next/image"
import { PR } from "@/types/pull_requests"
import CloseIcon from "../../../assets/svgs/close.svg"
import ExpandIcon from "../../../assets/svgs/expand.svg"
import Checkmark from "../../../assets/svgs/checkmark.svg"
import CommentIcon from "../../../assets/svgs/message.svg"
import * as Collapsible from "@radix-ui/react-collapsible"
import { collapsibleHeader } from "@/helpers/utils"

type CollapsiblePullRequestProps = {
    pullRequests: PR[]
    type: "merged" | "open" | "inactive" | "closed" | "closed by others"
    username: string
}

const CollapsiblePullRequest = ({
    pullRequests,
    type,
    username
}: CollapsiblePullRequestProps) => {
    const [open, setOpen] = React.useState(false)

    if (!pullRequests.length) {
        return null
    }

    return (
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
                    {`${pullRequests.length} ${type} pull requests`}
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
                {pullRequests.map((pullRequest, index) => {
                    return (
                        <div key={`${index}-${pullRequest.url}`}>
                            <div
                                key={index}
                                className="text-start rounded flex gap-2 flex-col items-start p-3 border border-comment-card-border h-[166px] my-4"
                            >
                                <p className="text-xs font-semibold text-card-comment-card-black">
                                    {username}/
                                    {collapsibleHeader(
                                        pullRequest.repoUrl,
                                        username
                                    )}
                                </p>
                                <section className="flex items-center gap-1">
                                    <Image
                                        src={Checkmark}
                                        alt="check mark icon"
                                        height={16}
                                        width={16}
                                    />
                                    <Link
                                        href={pullRequest.url}
                                        target="_blank"
                                        className="text-sm text-card-secondary-blue flex flex-wrap text-left justify-start items-start w-full tracking-tight"
                                    >
                                        {pullRequest.url}
                                    </Link>
                                </section>
                                <p className="text-sm h-[60px] overflow-hidden text-black">
                                    {pullRequest.title}
                                </p>

                                <div className="flex flex-row w-full gap-3 items-center text-xs text-black">
                                    <section className="flex items-center w-max gap-2">
                                        <Image
                                            src={pullRequest.avatarUrl}
                                            alt="avatar"
                                            height={16}
                                            width={16}
                                            className="rounded-[50%]"
                                        />
                                        <p>{username}</p>
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
                                            {`${
                                                pullRequest.totalComments
                                            }                                            ${
                                                pullRequest.totalComments === 1
                                                    ? "comment"
                                                    : "comments"
                                            }`}
                                        </p>
                                    </section>
                                    <span>•</span>
                                    <p className="text-[13px] whitespace-nowrap">
                                        Opened for: {pullRequest.daysOpened}{" "}
                                        days
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

export default CollapsiblePullRequest
