import { useEffect, useMemo, useState } from "react"
import { fetchIssues } from "@/app/components/search/action"
import {
    getLongComments,
    getOthersComments,
    getOwnComments
} from "@/helpers/get-comments"
import { getPullRequests } from "@/helpers/get-pull-requests"
import { Project, PRsObject } from "@/types/pull_requests"
import { useRouter, useSearchParams } from "next/navigation"
import {
    createGridSet,
    filterObject,
    generateGraphValues,
    getOrganisations,
    getYearlyContributions
} from "@/helpers/utils"
import { IssuesObject } from "@/types/comments"
import { Contribution } from "@/types"

export const useGithubIssues = () => {
    const Router = useRouter()
    const searchParams = useSearchParams()
    const username = searchParams.get("username")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear().toString()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [projects, setProjects] = useState<
        Array<Project & { position: number }>
    >([])
    const [toggleFilter, setToggleFilter] = useState<string | null>("")
    const [yearlyFilter, setYearlyFilter] = useState<string>(currentYear)
    const [toolTipKey, setToolTipKey] = useState<string | null>("")
    const [issuesObject, setIssuesObject] = useState<IssuesObject>({
        ownIssueComments: [],
        longIssueComments: [],
        othersIssueComments: []
    })
    const [prsObject, setPrsObject] = useState<PRsObject>({
        openPrs: [],
        openInactivePrs: [],
        closedPrs: [],
        closedPrsByOthers: [],
        mergedPrs: []
    })

    /**
     * We are using the Date object to create the startDate and endDate of the query range
     * new Date(): creates a date using the Date constructor
     * Number(args): Converts the string variable of args to a number
     *
     * 0, 1, 4 or 12, 0, 4: are parameters passed to the Date contructor to modify the Date object;
     * the first Argument: This specifies the month parameter
     * the second Argument: This specifies the day parameter
     * the first Argument: This specifies the time parameter, using the 24:00hr clock format
     */

    const startDate = new Date(Number(yearlyFilter), 0, 1, 4).toISOString()
    const endDate = new Date(Number(yearlyFilter), 12, 0, 4).toISOString()

    useEffect(() => {
        const fetchGithubIssues = async () => {
            if (!username) {
                return
            }
            setLoading(true)
            setError(null)

            setIssuesObject((prev) => ({
                ...prev,
                ownIssueComments: [],
                longIssueComments: [],
                othersIssueComments: []
            }))

            setPrsObject((prev) => ({
                ...prev,
                openPrs: [],
                openInactivePrs: [],
                closedPrs: [],
                closedPrsByOthers: [],
                mergedPrs: []
            }))
            setProjects([])

            const endCursor = localStorage.getItem("end_cursor") as string
            console.log(endCursor, "Saved End cursor")

            const { ranged_prs, ranged_issues } = await fetchIssues({
                username: username as string,
                startDate,
                endDate,
                endCursor
            })

            const rangedPrsData =
                ranged_prs?.data !== undefined ? ranged_prs.data : []
            const rangedIssuesData =
                ranged_issues?.data !== undefined ? ranged_issues.data : []

            const storedCursor =
                Number(yearlyFilter) <= Number(currentYear) - 1
                    ? endCursor
                    : ranged_issues?.endCursorObj?.end_cursor

            localStorage.setItem("end_cursor", storedCursor)

            setLoading(false)

            if (ranged_issues.error || ranged_prs.error) {
                setError(
                    ranged_issues?.error[0]?.message ||
                        ranged_prs?.error[0]?.message
                )
                setLoading(false)
                return
            }

            const issue = getOwnComments({
                data: rangedIssuesData,
                username: username as string
            })
            const longIssue = getLongComments({
                data: rangedIssuesData
            })
            const othersIssue = getOthersComments({
                data: rangedIssuesData,
                username: username as string
            })

            const {
                closedPRs,
                closedPRsByOthers,
                mergedPRs,
                openInactivePRs,
                openPRs
            } = getPullRequests({
                data: rangedPrsData,
                username: username as string
            })
            const { orgs } = getOrganisations(
                rangedPrsData,
                rangedIssuesData,
                username
            )

            setProjects(orgs)

            setIssuesObject((prev) => ({
                ...prev,
                ownIssueComments: issue,
                longIssueComments: longIssue,
                othersIssueComments: othersIssue
            }))

            setPrsObject((prev) => ({
                ...prev,
                openPrs: openPRs,
                openInactivePrs: openInactivePRs,
                closedPrs: closedPRs,
                closedPrsByOthers: closedPRsByOthers,
                mergedPrs: mergedPRs
            }))
        }

        fetchGithubIssues()
    }, [endDate, startDate, username])

    const memoizedIssues = useMemo(
        () => filterObject(toggleFilter, toolTipKey, issuesObject),
        [issuesObject, toggleFilter, toolTipKey]
    )

    const memoizedPrs = useMemo(
        () => filterObject(toggleFilter, toolTipKey, prsObject),
        [prsObject, toggleFilter, toolTipKey]
    )

    const { contributions } = getYearlyContributions(prsObject, issuesObject)
    const { gridSet } = createGridSet(yearlyFilter!)

    const memoizedGraphValues = useMemo(
        () => generateGraphValues(contributions, gridSet),
        [contributions, gridSet]
    )

    const handleFilterToggle = (key: string) => {
        setToggleFilter((prev) => (prev === key ? null : key))
    }

    const handleYearlyFilter = (key: string) => {
        if (key === yearlyFilter) return
        setYearlyFilter(key)
    }

    const onClickToolTip = (content: Contribution) => {
        if (!content.activity.length) {
            return `No content for ${content.date}`
        } else {
            return setToolTipKey((prev) =>
                prev === content.date ? null : content.date
            )
        }
    }

    const goBack = () => Router.back()

    return {
        projects,
        loading,
        error,
        memoizedIssues,
        memoizedPrs,
        handleFilterToggle,
        toggleFilter,
        yearlyFilter,
        handleYearlyFilter,
        memoizedGraphValues,
        onClickToolTip,
        goBack
    }
}
