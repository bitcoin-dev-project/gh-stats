import { ISSUES, PULL_REQUESTS } from "@/graphql/queries"

export async function getGithubData({
    username,
    token,
    query
}: {
    username: string
    token?: string
    query: "ISSUES" | "PULL_REQUESTS"
}) {
    const tokenFromEnv = process.env.GITHUB_TOKEN

    let graphqlQuery = ""
    switch (query) {
        case "ISSUES":
            graphqlQuery = ISSUES
            break
        case "PULL_REQUESTS":
            graphqlQuery = PULL_REQUESTS
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
                    username
                }
            })
        })
        if (!res.ok) {
            console.log("res", res)
            return { error: res.statusText, message: "Failed to fetch API" }
        }

        const data = await res.json()
        if (data.errors) {
            return { error: data.errors, message: "Failed to fetch API" }
        }

        return {
            data: data.data.user,
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
