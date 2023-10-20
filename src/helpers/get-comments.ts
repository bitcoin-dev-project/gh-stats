import { Comment } from "../types/comments"

export const getOwnComments = ({
    data,
    username
}: {
    data: any
    username: string
}): Comment[] => {
    const rawComments = data?.issueComments?.nodes.filter(
        (comment: any) => comment.issue.author.login === username
    )
    return rawComments.map((comment: any) => {
        return {
            body: comment.body,
            repository: comment.repository.url,
            url: comment.url,
            createdAt: comment.createdAt,
            issue: comment.issue,
            project: comment.repository.owner
        }
    })
}

export const getOthersComments = ({
    data,
    username
}: {
    data: any
    username: string
}): Comment[] => {
    const rawComments = data?.issueComments?.nodes.filter(
        (comment: any) => comment.issue.author.login !== username
    )
    return rawComments.map((comment: any) => {
        return {
            body: comment.body,
            repository: comment.repository.url,
            url: comment.url,
            createdAt: comment.createdAt,
            issue: comment.issue,
            project: comment.repository.owner
        }
    })
}

export const getLongComments = ({ data }: { data: any }): Comment[] => {
    const rawComments = data?.issueComments?.nodes.filter(
        (comment: any) => comment.body.length > 500
    )
    return rawComments.map((comment: any) => {
        return {
            body: comment.body,
            repository: comment.repository.url,
            url: comment.url,
            createdAt: comment.createdAt,
            issue: comment.issue,
            project: comment.repository.owner
        }
    })
}
