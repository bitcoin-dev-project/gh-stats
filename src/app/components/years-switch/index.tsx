import React from "react"

type YearSectionProps = {
    years: string[]
    currentYear: string | null
    handleClick: (year: string) => void
}

const YearSection = ({ years, currentYear, handleClick }: YearSectionProps) => {
    return (
        <div className="flex flex-col gap-1">
            {years.map((year) => (
                <div
                    className={`px-4 py-2 w-full cursor-pointer rounded-md max-w-[200px] ${
                        year === currentYear
                            ? "bg-secondary-blue text-white"
                            : "bg-transparent text-card-light-black"
                    }`}
                    onClick={() => handleClick(year)}
                    key={year}
                >
                    <p className="text-sm">{year}</p>
                </div>
            ))}
        </div>
    )
}

export default YearSection
