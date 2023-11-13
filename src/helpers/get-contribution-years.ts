import { FETCH_CONTRIBUTION_YEARS } from "@/graphql/queries"
import { PrDataType } from "@/types/pull_requests"

export async function getContributionYears({
    token,
    username
}: {
    token?: string
    username: string
}) {
    const tokenFromEnv = process.env.GITHUB_TOKEN

    try {
        const res = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token ?? tokenFromEnv}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: FETCH_CONTRIBUTION_YEARS,
                variables: {
                    username
                }
            })
        })

        if (!res.ok) {
            return { error: res.statusText, message: "Failed to fetch API" }
        }

        const data = await res.json()
        const jsonData: PrDataType = data.data.user

        const contributionYears =
            jsonData?.contributionsCollection.contributionYears

        if (data.errors) {
            return { error: data.errors, message: "Failed to fetch API" }
        }

        return {
            data: contributionYears,
            error: null
        }
    } catch (error) {
        return {
            error: error,
            message: "Failed to fetch API"
        }
    }
}
