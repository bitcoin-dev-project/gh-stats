import React from "react"
import { IssuesObject, PRsObject } from "@/types/pull_requests"
import CollaspsibleIssue from "../collapsible/issues"
import CollapsiblePullRequest from "../collapsible/pull-request"

export const IssuesAndPullRequests = ({
    issues,
    prs,
    username
}: {
    issues: IssuesObject
    prs: PRsObject
    username: string
}) => {
    return (
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
    )
}
