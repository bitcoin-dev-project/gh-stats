export type Comment = {
    issue: Issue
    body: string
    repository: string
    url: string
    createdAt: string
    project: { login: string; avatarUrl: string }
}

export type Issue = {
    author: {
        login: string
        avatarUrl: string
    }
    comments: {
        totalCount: number
    }
}
