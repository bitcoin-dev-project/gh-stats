import React from "react"

type YearSectionProps = {
    years: string[]
    data: any
    currentYear: string
    setCurrentYear: React.Dispatch<React.SetStateAction<string>>
}

const YearSection = ({
    years,
    data,
    currentYear,
    setCurrentYear
}: YearSectionProps) => {
    return (
        <div className="flex flex-col gap-1">
            {years.map((year) => (
                <div
                    className={`px-4 py-2 w-full cursor-pointer rounded-md max-w-[200px] ${
                        year === currentYear
                            ? "bg-secondary-blue text-white"
                            : "bg-transparent text-card-light-black"
                    }`}
                    onClick={() => setCurrentYear(year)}
                    key={year}
                >
                    <p className="text-sm">{year}</p>
                </div>
            ))}
        </div>
    )
}

export default YearSection
