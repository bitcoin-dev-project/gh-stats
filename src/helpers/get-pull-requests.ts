import { CURRENT_DAY, DAYS_TO_INACTIVE, ONE_DAY } from "@/config"

import { PullRequests, PR } from "../types/pull_requests"

export const getPullRequests = ({
    data,
    username
}: {
    data: any
    username: string
}): PullRequests => {
    const openPRsData = data.pullRequests.edges.filter(
        (pr: any) => pr.node.closed === false
    )
    const openPRs: PR[] = openPRsData.map((pr: any) => ({
        totalComments: pr.node.totalCommentsCount,
        daysOpened: Math.floor(
            (CURRENT_DAY - new Date(pr.node.createdAt).getTime()) / ONE_DAY
        ),
        url: pr.node.url,
        repoUrl: pr.node.repository.url,
        title: pr.node.title,
        createdAt: pr.node.createdAt,
        avatarUrl: pr.node.author.avatarUrl,
        project: pr.node.repository.owner
    }))

    const openInactivePRsData = openPRsData.filter(
        (pr: any) =>
            Math.floor(
                (CURRENT_DAY - new Date(pr.node.createdAt).getTime()) / ONE_DAY
            ) > DAYS_TO_INACTIVE
    )
    const openInactivePRs: PR[] = openInactivePRsData.map((pr: any) => ({
        totalComments: pr.node.totalCommentsCount,
        daysOpened: Math.floor(
            (CURRENT_DAY - new Date(pr.node.createdAt).getTime()) / ONE_DAY
        ),
        url: pr.node.url,
        repoUrl: pr.node.repository.url,
        title: pr.node.title,
        avatarUrl: pr.node.author.avatarUrl,
        project: pr.node.repository.owner,
        createdAt: pr.node.createdAt
    }))

    const closedPRsData = data.pullRequests.edges.filter(
        (pr: any) => pr.node.closed === true && pr.node.merged === false
    )
    const closedPRs: PR[] = closedPRsData.map((pr: any) => ({
        totalComments: pr.node.totalCommentsCount,
        daysOpened: Math.floor(
            (new Date(pr.node.closedAt).getTime() -
                new Date(pr.node.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr.node.url,
        repoUrl: pr.node.repository.url,
        title: pr.node.title,
        avatarUrl: pr.node.author.avatarUrl,
        project: pr.node.repository.owner,
        createdAt: pr.node.createdAt
    }))

    const closedPRsByOthersData = data.pullRequests.edges.filter(
        (pr: any) =>
            pr.node.closed === true &&
            pr.node.merged === true &&
            pr.node.mergedBy.login !== username
    )
    const closedPRsByOthers: PR[] = closedPRsByOthersData.map((pr: any) => ({
        totalComments: pr.node.totalCommentsCount,
        daysOpened: Math.floor(
            (new Date(pr.node.closedAt).getTime() -
                new Date(pr.node.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr.node.url,
        repoUrl: pr.node.repository.url,
        title: pr.node.title,
        avatarUrl: pr.node.author.avatarUrl,
        project: pr.node.repository.owner,
        createdAt: pr.node.createdAt
    }))

    const mergedPRData = data.pullRequests.edges.filter(
        (pr: any) => pr.node.merged === true
    )
    const mergedPRs: PR[] = mergedPRData.map((pr: any) => ({
        totalComments: pr.node.totalCommentsCount,
        daysOpened: Math.floor(
            (new Date(pr.node.mergedAt).getTime() -
                new Date(pr.node.createdAt).getTime()) /
                ONE_DAY
        ),
        url: pr.node.url,
        repoUrl: pr.node.repository.url,
        title: pr.node.title,
        avatarUrl: pr.node.author.avatarUrl,
        project: pr.node.repository.owner,
        createdAt: pr.node.createdAt
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
