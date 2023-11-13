"use server"

import { auth } from "@/auth"
import { getContributionYears } from "@/helpers/get-contribution-years"

export const fetchYears = async ({ params }: { params: any }) => {
    const session = await auth()
    const token = session?.accessToken

    const res = await Promise.all([
        getContributionYears({
            token,
            ...params
        })
    ])

    const years = res[0]

    return {
        years
    }
}
