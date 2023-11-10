import { FETCH_RANGED_COMMENTS } from "@/graphql/queries"
import { IssueCommentDataType, IssueComments } from "@/types/comments"

export async function getIssueCommentsData({
    username,
    token,
    query,
    startDate
}: {
    username: string
    token?: string
    query: "FETCH_RANGED_COMMENTS"
    startDate?: string
}) {
    const tokenFromEnv = process.env.GITHUB_TOKEN

    let graphqlQuery = ""
    switch (query) {
        case "FETCH_RANGED_COMMENTS":
            graphqlQuery = FETCH_RANGED_COMMENTS
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
            return { error: res.statusText, message: "Failed to fetch API" }
        }

        const data = await res.json()
        const jsonData: IssueCommentDataType = data.data.user

        let result: Partial<IssueCommentDataType> = {}
        let nodesResult = ""
        let yearlyResult: any = {}

        const hasNextPage = jsonData?.issueComments?.pageInfo?.hasNextPage

        if (hasNextPage === false) {
            for (const [key, value] of Object.entries(
                jsonData?.issueComments
            )) {
                if (key === "nodes" && Array.isArray(value)) {
                    yearlyResult[key] = value.filter(
                        (node) =>
                            node.createdAt.slice(0, 4) ===
                            // "2023"
                            startDate?.slice(0, 4)
                    )
                } else {
                    yearlyResult[key] = value
                }
            }

            return yearlyResult as IssueComments
        } else {
            for (const [key, value] of Object.entries(jsonData.issueComments)) {
            }
        }

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
