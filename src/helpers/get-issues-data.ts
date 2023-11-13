import { FETCH_RANGED_COMMENTS } from "@/graphql/queries"
import {
    IssueCommentDataType,
    IssueCommentNodes,
    IssueComments
} from "@/types/comments"

export async function getIssueCommentsData({
    username,
    token,
    query,
    startDate,
    endCursor
}: {
    username: string
    token?: string
    query: "FETCH_RANGED_COMMENTS"
    startDate?: string
    endCursor: string | null
}) {
    const tokenFromEnv = process.env.GITHUB_TOKEN
    let hasNextPage = true
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const prevYear = currentYear - 1
    const getYearFromDate = startDate?.slice(0, 4)

    endCursor = Number(getYearFromDate) <= prevYear ? endCursor : null

    if (
        getYearFromDate !== currentYear.toString() &&
        getYearFromDate !== prevYear.toString()
    ) {
        return {
            data: [],
            error: null
        }
    }

    let graphqlQuery = ""
    switch (query) {
        case "FETCH_RANGED_COMMENTS":
            graphqlQuery = FETCH_RANGED_COMMENTS
            break
        default:
            throw new Error("Invalid query")
    }

    let startCursorObj: any = {}
    let endCursorObj: any = {}

    let allIssueComments: Array<IssueCommentNodes> = []

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
                        endCursor
                    }
                })
            })

            if (!res.ok) {
                return { error: res.statusText, message: "Failed to fetch API" }
            }

            const data = await res.json()
            const jsonData: IssueCommentDataType = data.data.user

            const nodes_data = jsonData?.issueComments?.nodes
            const start_cursor = jsonData?.issueComments?.pageInfo?.startCursor
            const isNextPage = jsonData?.issueComments?.pageInfo?.hasNextPage
            const end_cursor = jsonData?.issueComments?.pageInfo?.endCursor

            // get previous year from start date of query
            const prevYear = Number(getYearFromDate) - 1

            const findNextYear = nodes_data?.find(
                // return first year that is a previous year, we are slicing the createdAt date to get current year of eaxh result
                (x) => x.createdAt.slice(0, 4) === prevYear.toString()
            )

            if (
                findNextYear ||
                (isNextPage === false && findNextYear === undefined)
            ) {
                // filter  previous year from response data, when previous year is found in current query date range
                const filter_node_data = nodes_data.filter((x) => {
                    return x.createdAt.slice(0, 4) === startDate?.slice(0, 4)
                })

                const res = filter_node_data

                allIssueComments.push(...res)

                hasNextPage = false
                endCursor = end_cursor

                endCursorObj["end_cursor"] = endCursor
            } else {
                allIssueComments.push(...nodes_data)
                hasNextPage = isNextPage

                endCursor = end_cursor
                startCursorObj["start_cursor"] = start_cursor
                endCursorObj["end_cursor"] = endCursor
            }

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

    allIssueComments
        .sort(
            (a, b) =>
                new Date(a?.createdAt).getTime() -
                new Date(b?.createdAt).getTime()
        )
        .filter((x) => x !== undefined)

    return {
        data: allIssueComments,
        error: null,
        startCursorObj,
        endCursorObj,
        hasNextPage
    }
}
