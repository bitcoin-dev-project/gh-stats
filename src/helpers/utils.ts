import {
    Contribution,
    Contributions,
    GridSet,
    GRID_BLUE,
    GRID_GRAY,
    GRID_GREEN,
    GRID_YELLOW
} from "@/types"
import { Comment, IssueCommentNodes, IssuesObject } from "@/types/comments"
import { PrNodes, Project, PRsObject } from "@/types/pull_requests"

export const getIssueNumber = (arg: string) => {
    const splitUrl = arg.split("#")
    const firstItem = splitUrl[0].split("/")
    return firstItem[firstItem.length - 1]
}

export const contentHeading = (
    issues: Comment[],
    type: "own" | "others" | "long"
) => {
    if (type === "long" && issues.length === 1) {
        return `${issues.length} long comment on issues`
    } else if (type !== "long" && issues.length === 1) {
        return `${issues.length} comment on ${type} issues`
    } else if (type === "long" && issues.length > 1) {
        return `${issues.length} long comments on issues`
    } else {
        return `${issues.length} comments on ${type} issues`
    }
}

export const collapsibleHeader = (repoUrl: string, username: string) => {
    repoUrl = `${repoUrl}/`
    const splitRepoUrl = repoUrl.split(".com/")

    const getCoy = splitRepoUrl[1].split("/").slice(0, 2)
    if (getCoy[0].toLowerCase() === username.toLowerCase()) return getCoy[1]

    return getCoy.join("-")
}

export const getOrganisations = (
    prsData: PrNodes[],
    issueData: IssueCommentNodes[],
    username: string
) => {
    const prOrgs: Array<Project> = prsData
        ?.filter(
            (pr) =>
                pr?.pullRequest?.repository.owner.login.toLowerCase() !==
                    username.toLowerCase() && pr?.pullRequest !== undefined
        )
        .map((pr) => ({
            login: pr?.pullRequest?.repository.owner.login,
            avatarUrl: pr?.pullRequest?.repository.owner.avatarUrl
        }))

    const issueOrgs: Array<Project> = issueData
        ?.filter(
            (issue) =>
                issue.repository.owner.login.toLowerCase() !==
                username.toLowerCase()
        )
        .map((issue: any) => ({
            login: issue.repository.owner.login,
            avatarUrl: issue.repository.owner.avatarUrl
        }))

    const allOrgs = [...prOrgs, ...issueOrgs].reduce(
        (acc, curr) => {
            const key = curr.login

            const group = acc[key] ?? []
            return { ...acc, [key]: [...group, curr] }
        },
        {} as Record<string, Array<{ login: string; avatarUrl: string }>>
    )

    const addOrgPosition = []
    for (const [key, value] of Object.entries(allOrgs)) {
        if (key) {
            addOrgPosition.push({
                login: value[0].login,
                avatarUrl: value[0].avatarUrl,
                position: value.length
            })
        }
    }
    const orgs = addOrgPosition.sort((a, c) => c.position - a.position)

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
    toolTipKey: string | null,
    data: Type
): Type {
    const filteredObject: any = {}

    if (toolTipKey) {
        for (const [key, value] of Object.entries(data)) {
            filteredObject[key] = value.filter((x) => {
                const result_date = new Date(x.createdAt)
                    .toDateString()
                    .split(" ")
                    .slice(1, 3)
                    .join(" ")

                return result_date === toolTipKey
            })

            if (toggleFilter) {
                for (const [key, value] of Object.entries(data)) {
                    filteredObject[key] = value.filter((x) => {
                        const result_date = new Date(x.createdAt)
                            .toDateString()
                            .split(" ")
                            .slice(1, 3)
                            .join(" ")

                        return (
                            result_date === toolTipKey &&
                            x.project?.login?.toLowerCase() ===
                                toggleFilter?.toLowerCase()
                        )
                    })
                }
            }
        }

        return filteredObject
    }

    if (toggleFilter) {
        for (const [key, value] of Object.entries(data)) {
            filteredObject[key] = value.filter(
                (x) =>
                    x.project?.login?.toLowerCase() ===
                    toggleFilter?.toLowerCase()
            )
        }

        return filteredObject
    } else {
        return data
    }
}

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

export const days = ["Mon", "Wed", "Fri"]

export const getYearlyContributions = (
    prsData: PRsObject,
    issueData: IssuesObject
) => {
    const monthsObject: Record<
        string,
        Array<{ date: string; type: string }>
    > = {}
    const contributions: Contributions = {}

    const extractPrDates = Object.values(prsData)
        .map((set) => {
            return set.map((x) => {
                return {
                    date: new Date(x.createdAt).toDateString(),
                    type: "prs"
                }
            })
        })
        .flat()

    const extractIssueDates = Object.values(issueData)
        .map((set) => {
            return set.map((x) => {
                return {
                    date: new Date(x.createdAt).toDateString(),
                    type: "issues"
                }
            })
        })
        .flat()

    const allDates = [...extractPrDates, ...extractIssueDates]

    for (let m = 0; m < months.length; m++) {
        const monthElem = months[m]

        for (let index = 0; index < allDates.length; index++) {
            const dateElem = allDates[index]

            if (dateElem.date.includes(monthElem)) {
                const dates = monthsObject[monthElem] ?? []
                monthsObject[monthElem] = [...dates, dateElem]
            }
        }
    }

    for (const [key, value] of Object.entries(monthsObject)) {
        const sorted = value
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .reduce((a, c) => {
                const key = c.date

                const currGroup = a[key] ?? []

                return { ...a, [key]: [...currGroup, c] }
            }, {} as any)

        contributions[key] = sorted
    }

    for (const [_, value] of Object.entries(contributions)) {
        Object.keys(value).map((ky) => {
            let newKey = ky?.split(" ")[2]
            newKey = Number(newKey) <= 9 ? newKey.slice(1) : newKey
            value[newKey] = [...value[ky]]

            delete value[ky]
        })
    }

    return { contributions }
}

export const createGridSet = (year: string) => {
    const isLeapYear = Number(year) % 2 === 0

    const monthsNIndex = months.map((month) => {
        if (!isLeapYear && month === "Feb") {
            return { month, boxes: 28, is_active: false }
        } else if (
            month === "Apr" ||
            month === "Jun" ||
            month === "Sep" ||
            month === "Nov"
        ) {
            return { month, boxes: 30, is_active: false }
        } else {
            return { month, boxes: 31, is_active: false }
        }
    })

    const gridSet = monthsNIndex.map((mth) => {
        return {
            ...mth,
            boxes: Array.from({ length: mth.boxes }, (_, idx) => ({
                day: idx + 1,
                is_active: false
            }))
        }
    })

    return { gridSet }
}

export const generateGraphValues = (
    contributions: Contributions,
    gridSet: GridSet
) => {
    const graphValues = gridSet.map((sect) => {
        if (!contributions?.[sect.month]) {
            return sect.boxes.map((day) => ({
                ...day,
                is_active: false,
                desc: `No contributions on ${sect.month} ${day.day}`,
                date: `${sect.month} ${day.day}`,
                activity: []
            }))
        } else {
            const addContributions = sect.boxes.map((contrib) => {
                const activity = contributions[sect.month][contrib.day] ?? []
                const activity_count = activity.length
                const day =
                    Number(contrib.day) <= 9 ? `0${contrib.day}` : contrib.day

                const date = `${sect.month} ${day}`
                const desc =
                    activity_count === 0
                        ? `No contribution on ${sect.month} ${contrib.day}`
                        : activity_count === 1
                        ? `1 contribution on ${sect.month} ${contrib.day}`
                        : `${activity_count} contributions on ${sect.month} ${contrib.day}`

                if (!activity || activity_count === 0) {
                    return {
                        ...contrib,
                        is_active: false,
                        desc,
                        date,
                        activity
                    }
                } else {
                    return {
                        ...contrib,
                        is_active: true,
                        desc,
                        date,
                        activity
                    }
                }
            })

            return addContributions
        }
    })

    return graphValues.flat()
}

export const boxColor = (arg: Contribution) => {
    const { activity, is_active } = arg

    if (!activity.length || is_active === false) {
        return GRID_GRAY
    } else {
        if (activity) {
            const allTypes = Array.from(new Set(activity.map((x) => x.type)))

            if (allTypes.length === 1) {
                if (allTypes.includes("issues")) {
                    return GRID_YELLOW
                } else if (allTypes.includes("prs")) {
                    return GRID_BLUE
                } else {
                    return GRID_GRAY
                }
            } else {
                return GRID_GREEN
            }
        }
    }
}
