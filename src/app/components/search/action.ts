"use server"

import { auth } from "@/auth"
import { getIssueCommentsData } from "@/helpers/get-issues-data"
import { getGithubPrsData } from "@/helpers/get-prs-data"

export const fetchIssues = async ({
    username,
    startDate,
    endDate,
    endCursor
}: {
    username: string
    startDate?: string
    endDate?: string
    endCursor: string
}) => {
    const session = await auth()
    const token = session?.accessToken

    const ranged_response = await Promise.all([
        getGithubPrsData({
            username,
            token,
            query: "FETCH_RANGED_PRS",
            startDate,
            endDate
        }),
        getIssueCommentsData({
            username,
            token,
            query: "FETCH_RANGED_COMMENTS",
            startDate,
            endCursor
        })
    ])

    const ranged_prs = ranged_response[0]
    const ranged_issues = ranged_response[1]

    return {
        ranged_prs,
        ranged_issues
    }
}
