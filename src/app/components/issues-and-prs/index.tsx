import React from "react"
import { PRsObject } from "@/types/pull_requests"
import CollaspsibleIssue from "../collapsible/issues"
import CollapsiblePullRequest from "../collapsible/pull-request"
import { IssuesObject } from "@/types/comments"
import Skeleton from "../skeleton"

export const IssuesAndPullRequests = ({
    issues,
    prs,
    username,
    loading
}: {
    issues: IssuesObject
    prs: PRsObject
    username: string
    loading: boolean
}) => {
    return (
        <section className="overflow-hidden overflow-y-scroll max-w-[782px]">
            {loading ? (
                <div className="flex items-center justify-center flex-col gap-4">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-w-[768px]">
                    <>
                        {issues?.ownIssueComments.length > 0 && (
                            <CollaspsibleIssue
                                type="own"
                                issues={issues?.ownIssueComments}
                                username={username}
                            />
                        )}
                    </>
                    <>
                        {issues?.longIssueComments.length > 0 && (
                            <CollaspsibleIssue
                                type="long"
                                issues={issues?.longIssueComments}
                                username={username}
                            />
                        )}
                    </>
                    <>
                        {issues?.othersIssueComments.length > 0 && (
                            <CollaspsibleIssue
                                type="others"
                                issues={issues?.othersIssueComments}
                                username={username}
                            />
                        )}
                    </>
                    <>
                        {prs.openPrs.length > 0 && (
                            <CollapsiblePullRequest
                                type="open"
                                pullRequests={prs.openPrs}
                                username={username}
                            />
                        )}
                    </>
                    <>
                        {prs.openInactivePrs.length > 0 && (
                            <CollapsiblePullRequest
                                type="inactive"
                                pullRequests={prs.openInactivePrs}
                                username={username}
                            />
                        )}
                    </>
                    <>
                        {prs.mergedPrs.length > 0 && (
                            <CollapsiblePullRequest
                                type="merged"
                                pullRequests={prs.mergedPrs}
                                username={username}
                            />
                        )}
                    </>
                    <>
                        {prs.closedPrs.length > 0 && (
                            <CollapsiblePullRequest
                                type="closed"
                                pullRequests={prs.closedPrs}
                                username={username}
                            />
                        )}
                    </>
                </div>
            )}
        </section>
    )
}
