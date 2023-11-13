import { FETCH_RANGED_PRS } from "@/graphql/queries"
import { PrDataType, PrNodes } from "@/types/pull_requests"

export async function getGithubPrsData({
    username,
    token,
    query,
    startDate,
    endDate
}: {
    username: string
    token?: string
    query: "FETCH_RANGED_PRS"
    startDate?: string
    endDate?: string
}) {
    const tokenFromEnv = process.env.GITHUB_TOKEN

    let graphqlQuery = ""
    switch (query) {
        case "FETCH_RANGED_PRS":
            graphqlQuery = FETCH_RANGED_PRS
            break
        default:
            throw new Error("Invalid query")
    }

    let hasNextPage = true
    let allPrs: Array<PrNodes> = []
    let endCursor = null

    while (hasNextPage) {
        try {
            const res = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token ?? tokenFromEnv}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: graphqlQuery,
                    variables: {
                        username,
                        startDate,
                        endDate,
                        endCursor
                    }
                })
            })

            if (!res.ok) {
                return { error: res.statusText, message: "Failed to fetch API" }
            }

            const data = await res.json()
            const jsonData: PrDataType = data.data.user

            const isNextPage =
                jsonData?.contributionsCollection?.pullRequestContributions
                    ?.pageInfo.hasNextPage

            const nodes_data =
                jsonData?.contributionsCollection?.pullRequestContributions
                    .nodes

            const next_batch =
                jsonData?.contributionsCollection?.pullRequestContributions
                    ?.pageInfo?.endCursor

            allPrs.push(...nodes_data)
            hasNextPage = isNextPage
            endCursor = next_batch

            if (data.errors) {
                return { error: data.errors, message: "Failed to fetch API" }
            }
        } catch (error) {
            return {
                error: error,
                message: "Failed to fetch API"
            }
        }
    }

    allPrs
        .sort(
            (a, b) =>
                new Date(a?.pullRequest.createdAt).getTime() -
                new Date(b?.pullRequest.createdAt).getTime()
        )
        .filter((x) => x?.pullRequest !== undefined)

    return { data: allPrs, error: null }
}
