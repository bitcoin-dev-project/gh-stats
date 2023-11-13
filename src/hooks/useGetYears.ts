import React from "react"
import { useSearchParams } from "next/navigation"
import { fetchYears } from "@/app/components/search/contribution-years"

export const useGetYears = () => {
    const searchParams = useSearchParams()
    const username = searchParams.get("username")
    const [years, setYears] = React.useState<string[]>([])

    React.useEffect(() => {
        const getContributionByYear = async () => {
            const params = {
                username: username as string
            }
            const { years } = await fetchYears({
                params
            })

            const yearsData =
                years?.data !== undefined
                    ? years.data.map((yr) => yr.toString())
                    : []
            setYears(yearsData)
        }

        getContributionByYear()
    }, [username])

    return { years }
}
