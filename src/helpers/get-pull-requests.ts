import { CURRENT_DAY, DAYS_TO_INACTIVE, ONE_DAY } from "@/config"

import { PullRequests, PR, PrNodes } from "../types/pull_requests"

export const getPullRequests = ({
    data,
    username
}: {
    data: PrNodes[]
    username: string
}): PullRequests => {
    data = data !== undefined ? data : []

    const openPRsData = data?.filter((pr) => pr?.pullRequest?.closed === false)

    const openPRs: PR[] = openPRsData?.map((pr) => ({
        totalComments: pr?.pullRequest?.totalCommentsCount,
        daysOpened: Math.floor(
            (CURRENT_DAY - new Date(pr?.pullRequest?.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr?.pullRequest?.url,
        repoUrl: pr?.pullRequest?.repository.url,
        title: pr?.pullRequest?.title,
        createdAt: pr?.pullRequest?.createdAt,
        avatarUrl: pr?.pullRequest?.author.avatarUrl,
        project: pr?.pullRequest?.repository.owner
    }))

    const openInactivePRsData = openPRsData?.filter(
        (pr) =>
            Math.floor(
                (CURRENT_DAY - new Date(pr?.pullRequest.createdAt).getTime()) /
                    ONE_DAY
            ) > DAYS_TO_INACTIVE
    )

    const openInactivePRs: PR[] = openInactivePRsData?.map((pr) => ({
        totalComments: pr?.pullRequest?.totalCommentsCount,
        daysOpened: Math.floor(
            (CURRENT_DAY - new Date(pr?.pullRequest?.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr?.pullRequest?.url,
        repoUrl: pr?.pullRequest?.repository.url,
        title: pr?.pullRequest?.title,
        createdAt: pr?.pullRequest?.createdAt,
        avatarUrl: pr?.pullRequest?.author.avatarUrl,
        project: pr?.pullRequest?.repository.owner
    }))

    const closedPRsData = data?.filter(
        (pr) =>
            pr?.pullRequest?.closed === true &&
            pr?.pullRequest?.merged === false
    )

    const closedPRs: PR[] = closedPRsData?.map((pr) => ({
        totalComments: pr?.pullRequest?.totalCommentsCount,
        daysOpened: Math.floor(
            (new Date(pr?.pullRequest?.closedAt).getTime() -
                new Date(pr?.pullRequest?.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr?.pullRequest?.url,
        repoUrl: pr?.pullRequest?.repository.url,
        title: pr?.pullRequest?.title,
        createdAt: pr?.pullRequest?.createdAt,
        avatarUrl: pr?.pullRequest?.author.avatarUrl,
        project: pr?.pullRequest?.repository.owner
    }))

    const closedPRsByOthersData = data?.filter(
        (pr) =>
            pr?.pullRequest?.closed === true &&
            pr?.pullRequest?.merged === true &&
            pr?.pullRequest?.mergedBy.login !== username
    )

    const closedPRsByOthers: PR[] = closedPRsByOthersData?.map((pr) => ({
        totalComments: pr?.pullRequest?.totalCommentsCount,
        daysOpened: Math.floor(
            (new Date(pr?.pullRequest?.closedAt).getTime() -
                new Date(pr?.pullRequest?.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr?.pullRequest?.url,
        repoUrl: pr?.pullRequest?.repository.url,
        title: pr?.pullRequest?.title,
        createdAt: pr?.pullRequest?.createdAt,
        avatarUrl: pr?.pullRequest?.author.avatarUrl,
        project: pr?.pullRequest?.repository.owner
    }))

    const mergedPRData = data?.filter((pr) => pr?.pullRequest?.merged === true)

    const mergedPRs: PR[] = mergedPRData?.map((pr) => ({
        totalComments: pr?.pullRequest?.totalCommentsCount,
        daysOpened: Math.floor(
            (new Date(pr?.pullRequest?.mergedAt).getTime() -
                new Date(pr?.pullRequest?.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr?.pullRequest?.url,
        repoUrl: pr?.pullRequest?.repository.url,
        title: pr?.pullRequest?.title,
        createdAt: pr?.pullRequest?.createdAt,
        avatarUrl: pr?.pullRequest?.author.avatarUrl,
        project: pr?.pullRequest?.repository.owner
    }))

    openPRs.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    openInactivePRs.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    closedPRs.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    closedPRsByOthers.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    mergedPRs.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return {
        openPRs,
        openInactivePRs,
        closedPRs,
        closedPRsByOthers,
        mergedPRs
    }
}
