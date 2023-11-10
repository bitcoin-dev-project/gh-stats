"use server"

import { auth } from "@/auth"
import { getContributionYears } from "@/helpers/get-contribution-years"
import { getGithubData } from "@/helpers/get-github-data"
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

    const res = await Promise.all([
        getGithubData({
            username,
            token,
            query: "ISSUES"
        }),
        getGithubData({
            username,
            token,
            query: "PULL_REQUESTS"
        }),
        getContributionYears({
            username,
            token,
            query: "FETCH_RANGED_PRS",
            startDate,
            endDate
        })
    ])

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

    const issues = res[0]
    const prs = res[1]
    const years = res[2]
    const ranged_prs = ranged_response[0]
    const ranged_issues = ranged_response[1]

    return {
        issues,
        prs,
        years,
        ranged_prs,
        ranged_issues
    }
}
