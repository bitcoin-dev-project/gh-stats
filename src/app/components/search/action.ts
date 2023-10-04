"use server"

import { auth } from "@/auth"
import { getGithubData } from "@/helpers/get-github-data"

export const fetchIssues = async ({ username }: { username: string }) => {
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
        })
    ])

    const issues = res[0]
    const prs = res[1]
    return { issues, prs }
}
