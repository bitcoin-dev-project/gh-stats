import { FETCH_RANGED_PRS } from "@/graphql/queries"
import { PrDataType } from "@/types/pull_requests"

export async function getContributionYears({
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
                    endDate
                }
            })
        })

        if (!res.ok) {
            console.log("res", res)
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
        console.log(error)
        return {
            error: error,
            message: "Failed to fetch API"
        }
    }
}
