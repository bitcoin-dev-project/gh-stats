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
    extractYears,
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
    const [projects, setProjects] = useState<Array<Project>>([])
    const [toggleFilter, setToggleFilter] = useState<string | null>("")
    const [years, setYears] = useState<Array<string>>([])
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
            setYears([])
            const { issues, prs, ranged_prs, ranged_issues, years } =
                await fetchIssues({
                    username: username as string,
                    startDate,
                    endDate
                })

            setLoading(false)

            if (issues.error || prs.error) {
                console.error(issues.error, "error")
                setError(issues.error[0].message || prs.error[0].message)
                setLoading(false)
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
                data: ranged_prs.data!,
                username: username as string
            })
            const { orgs } = getOrganisations(
                ranged_prs?.data!,
                issues.data,
                username
            )

            setProjects(orgs)
            setYears(years.data!)

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
        years,
        memoizedGraphValues,
        onClickToolTip,
        goBack
    }
}
