export type Contributions = Record<
    string,
    Record<string, Array<{ date: string; type: string }>>
>

export type PageInfo = {
    hasNextPage: boolean
    startCursor: string
    endCursor: string
}

export type Repository = {
    url: string
    owner: {
        login: string
        avatarUrl: string
    }
}

export type GridSet = {
    month: string
    boxes: Array<{ day: number; is_active: boolean }>
    is_active: boolean
}[]

export type Contribution = {
    is_active: boolean
    desc: string
    day: number
    date: string
    activity: Array<{ date: string; type: string }>
}

export const GRID_YELLOW = "#E7C23E"
export const GRID_BLUE = "#0783F5"
export const GRID_GRAY = "#EEEEEE"
export const GRID_GREEN = "#39D353"
export const MAX_COMMENT_LENGTH = 500
