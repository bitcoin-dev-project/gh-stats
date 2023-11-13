import { PageInfo, Repository } from "."

export type PrDataType = {
    contributionsCollection: {
        contributionYears: Array<string>
        pullRequestContributions: {
            pageInfo: PageInfo
            nodes: Array<PrNodes>
        }
    }
}

export type PrNodes = {
    pullRequest: {
        author: { avatarUrl: string }
        closed: boolean
        closedAt: string
        createdAt: string
        merged: boolean
        mergedAt: string
        mergedBy: { login: string }
        repository: Repository
        title: string
        totalCommentsCount: number
        url: string
    }
}

export type PR = {
    totalComments: number
    daysOpened: number
    url: string
    repoUrl: string
    title: string
    avatarUrl: string
    project: Project
    createdAt: string | number | Date
}

export type PullRequests = {
    mergedPRs: PR[]
    openPRs: PR[]
    openInactivePRs: PR[]
    closedPRs: PR[]
    closedPRsByOthers: PR[]
}

export type PRsObject = {
    openPrs: PR[]
    openInactivePrs: PR[]
    closedPrs: PR[]
    closedPrsByOthers: PR[]
    mergedPrs: PR[]
}

export type Project = {
    login: string
    avatarUrl: string
}
