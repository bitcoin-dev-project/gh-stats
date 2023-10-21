import { Comment } from "@/types/comments"
import { IssuesObject, Project, PRsObject } from "@/types/pull_requests"

export const getIssueNumber = (arg: string) => {
    const splitUrl = arg.split("#")
    const firstItem = splitUrl[0].split("/")
    return firstItem[firstItem.length - 1]
}

export const contentHeading = (
    issues: Comment[],
    type: "own" | "others" | "long"
) => {
    return type === "long" && issues.length === 1
        ? `${issues.length} long comment on issues`
        : type !== "long" && issues.length === 1
        ? `${issues.length} comment on ${type} issues`
        : type === "long" && issues.length > 1
        ? `${issues.length} long comments on issues`
        : `${issues.length} comments on ${type} issues`
}

export const collapsibleHeader = (repoUrl: string, username: string) => {
    repoUrl = `${repoUrl}/`
    const splitRepoUrl = repoUrl.split(".com/")

    const getCoy = splitRepoUrl[1].split("/").slice(0, 2)
    if (getCoy[0].toLowerCase() === username.toLowerCase()) return getCoy[1]

    return getCoy.join("-")
}

export const getOrganisations = (
    prsData: any,
    issueData: any,
    username: string
) => {
    const prOrgs: Array<Project> = prsData?.pullRequests?.edges
        .filter(
            (pr: any) =>
                pr.node.repository.owner.login.toLowerCase() !==
                username.toLowerCase()
        )
        .map((pr: any) => ({
            login: pr.node.repository.owner.login,
            avatarUrl: pr.node.repository.owner.avatarUrl
        }))

    const issueOrgs: Array<Project> = issueData?.issueComments?.nodes
        .filter(
            (issue: any) =>
                issue.repository.owner.login.toLowerCase() !==
                username.toLowerCase()
        )
        .map((issue: any) => ({
            login: issue.repository.owner.login,
            avatarUrl: issue.repository.owner.avatarUrl
        }))

    const orgs = [...prOrgs, ...issueOrgs].filter(
        (value, index, arr) =>
            arr.map((x) => x.login).indexOf(value.login) === index
    )

    return { orgs }
}

export const extractYears = (prsData: PRsObject, issueData: IssuesObject) => {
    const totalDataSet = { ...prsData, ...issueData }

    const years = Array.from(
        new Set(
            Object.values(totalDataSet)
                .map((set) => {
                    return set.map((item) =>
                        item.createdAt.toString().slice(0, 4)
                    )
                })
                .flat()
        )
    )

    return { years }
}

export function filterObject<Type extends { [s: string]: Array<any> }>(
    toggleFilter: string | null,
    yearlyFilter: string | null,
    data: Type
): Type {
    const filteredObject: any = {}

    if (toggleFilter) {
        for (const [key, value] of Object.entries(data)) {
            filteredObject[key] = value.filter(
                (x) =>
                    x.project?.login?.toLowerCase() ===
                    toggleFilter?.toLowerCase()
            )

            if (yearlyFilter) {
                for (const [key, value] of Object.entries(
                    filteredObject as Type
                )) {
                    filteredObject[key] = value.filter(
                        (x) =>
                            x.createdAt.toString().slice(0, 4) ===
                                yearlyFilter &&
                            x.project?.login?.toLowerCase() ===
                                toggleFilter?.toLowerCase()
                    )
                }
            }
        }
        return filteredObject
    } else if (yearlyFilter) {
        for (const [key, value] of Object.entries(data)) {
            filteredObject[key] = value.filter(
                (x) => x.createdAt.toString().slice(0, 4) === yearlyFilter
            )
        }

        return filteredObject
    } else {
        return data
    }
}
