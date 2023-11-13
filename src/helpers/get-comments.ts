import { Comment, IssueCommentNodes } from "@/types/comments"

export const getOwnComments = ({
    data,
    username
}: {
    data: IssueCommentNodes[]
    username: string
}): Comment[] => {
    data = data !== undefined ? data : []

    const rawComments = data?.filter(
        (comment) => comment.issue.author.login === username
    )

    const comments: Comment[] = rawComments?.map((comment) => {
        return {
            body: comment.body,
            repository: comment.repository.url,
            url: comment.url,
            createdAt: comment.createdAt,
            issue: comment.issue,
            project: comment.repository.owner
        }
    })

    comments.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return comments
}

export const getOthersComments = ({
    data,
    username
}: {
    data: IssueCommentNodes[]
    username: string
}): Comment[] => {
    data = data !== undefined ? data : []

    const rawComments = data?.filter(
        (comment) => comment.issue.author.login !== username
    )

    const comments: Comment[] = rawComments?.map((comment) => {
        return {
            body: comment.body,
            repository: comment.repository.url,
            url: comment.url,
            createdAt: comment.createdAt,
            issue: comment.issue,
            project: comment.repository.owner
        }
    })

    comments.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return comments
}

export const getLongComments = ({
    data
}: {
    data: IssueCommentNodes[]
}): Comment[] => {
    data = data !== undefined ? data : []

    const rawComments = data?.filter((comment) => comment.body.length > 500)

    const comments: Comment[] = rawComments?.map((comment) => {
        return {
            body: comment.body,
            repository: comment.repository.url,
            url: comment.url,
            createdAt: comment.createdAt,
            issue: comment.issue,
            project: comment.repository.owner
        }
    })

    comments.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return comments
}
