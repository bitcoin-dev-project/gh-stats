import { useEffect, useMemo, useState } from "react"
import { fetchIssues } from "@/app/components/search/action"
import {
    getLongComments,
    getOthersComments,
    getOwnComments
} from "@/helpers/get-comments"
import { getPullRequests } from "@/helpers/get-pull-requests"
import { Project, PRsObject } from "@/types/pull_requests"
import { useSearchParams } from "next/navigation"
import {
    createGridSet,
    extractYears,
    filterObject,
    generateGraphValues,
    getOrganisations,
    getYearlyContributions
} from "@/helpers/utils"
import { IssuesObject } from "@/types/comments"
import { Contribution } from "@/types"

export const useGithubIssues = () => {
    const searchParams = useSearchParams()
    const username = searchParams.get("username")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear().toString()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [projects, setProjects] = useState<Array<Project>>([])
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
            const { issues, prs } = await fetchIssues({
                username: username as string
            })

            setLoading(false)

            if (issues.error || prs.error) {
                console.error(issues.error, "error")
                setError(issues.error[0].message || prs.error[0].message)
                return
            }

            const issue = getOwnComments({
                data: issues.data,
                username: username as string
            })
            const longIssue = getLongComments({
                data: issues.data
            })
            const othersIssue = getOthersComments({
                data: issues.data,
                username: username as string
            })
            const {
                closedPRs,
                closedPRsByOthers,
                mergedPRs,
                openInactivePRs,
                openPRs
            } = getPullRequests({
                data: prs.data,
                username: username as string
            })
            const { orgs } = getOrganisations(prs.data, issues.data, username)

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
    }, [username])

    const memoizedIssues = useMemo(
        () =>
            filterObject(toggleFilter, yearlyFilter, toolTipKey, issuesObject),
        [issuesObject, toggleFilter, toolTipKey, yearlyFilter]
    )

    const memoizedPrs = useMemo(
        () => filterObject(toggleFilter, yearlyFilter, toolTipKey, prsObject),
        [prsObject, toggleFilter, toolTipKey, yearlyFilter]
    )

    const { years } = extractYears(prsObject, issuesObject)

    const { contributions } = getYearlyContributions(
        yearlyFilter,
        prsObject,
        issuesObject
    )
    const { gridSet } = createGridSet(yearlyFilter!)

    const memoizedGraphValues = useMemo(
        () => generateGraphValues(contributions, gridSet),
        [contributions, gridSet]
    )

    const handleFilterToggle = (key: string) => {
        setToggleFilter((prev) => (prev === key ? null : key))
    }

    const handleYearlyFilter = (key: string) => {
        setYearlyFilter((prev) => (prev === key ? prev : key))
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
        years,
        memoizedGraphValues,
        onClickToolTip
    }
}
