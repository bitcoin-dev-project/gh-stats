export type PR = {
    totalComments: number
    daysOpened: number
    url: string
    repoUrl: string
    title: string
}

export type PullRequests = {
    mergedPRs: PR[]
    openPRs: PR[]
    openInactivePRs: PR[]
    closedPRs: PR[]
    closedPRsByOthers: PR[]
}
