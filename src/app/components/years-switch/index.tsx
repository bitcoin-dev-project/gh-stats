import React from "react"
import Image from "next/image"
import downIcon from "../../assets/svgs/down-icon.svg"

type YearSectionProps = {
    years: string[]
    currentYear: string | null
    handleClick: (year: string) => void
}

const YearSection = ({ years, currentYear, handleClick }: YearSectionProps) => {
    const [showYears, setShowYears] = React.useState(false)

    return (
        <div className="w-full sm:p-4 md:p-9 lg:px-8 sm:px-4 md:px-4 sm:py-8 h-max rounded-[15px] p-0 flex items-end justify-end absolute top-9 right-4 sm:relative sm:block sm:top-0 sm:right-0">
            <div className="sm:flex-col gap-1 sm:block hidden">
                {years.map((year) => (
                    <div
                        className={`px-4 py-2 sm:w-full cursor-pointer rounded-md max-w-[200px] ${
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

            <div className="sm:hidden block">
                <section className="text-black flex border border-card-border-color rounded-md bg-card-bg shadow-card-shadow w-max items-center justify-center cursor-pointer tracking-tighter text-sm">
                    <span
                        className={`px-4 py-[8px] rounded-md rounded-r-none ${
                            years.length === 1
                                ? "rounded-r-md"
                                : "rounded-r-none"
                        } ${
                            years[0] === currentYear
                                ? "bg-secondary-blue text-white"
                                : "bg-white text-card-light-black"
                        }`}
                        onClick={() => handleClick(years[0])}
                    >
                        {years.slice(0, 1)}
                    </span>
                    <button
                        className={`px-2 pl-2 py-[8px] border-l-card-border-color border-l-1 rounded-md ${
                            years.length === 1 ? "hidden" : "block"
                        }`}
                        onClick={() => setShowYears(!showYears)}
                    >
                        <Image
                            src={downIcon}
                            alt="down-icon"
                            height={16}
                            width={16}
                        />
                    </button>
                </section>
                {showYears ? (
                    <section className="flex flex-col gap-1 border-card-border-color border rounded-md shadow-card-shadow bg-white mt-3">
                        {years.slice(1).map((year) => (
                            <div
                                key={year}
                                className={`p-2 pl-4 pr-4 cursor-pointer rounded-md ${
                                    year === currentYear
                                        ? "bg-secondary-blue text-white"
                                        : "bg-transparent text-card-light-black"
                                }`}
                                onClick={() => handleClick(year)}
                            >
                                <p
                                    className={`text-sm text-black ${
                                        year === currentYear
                                            ? "text-white"
                                            : "text-black"
                                    }`}
                                >
                                    {year}
                                </p>
                            </div>
                        ))}
                    </section>
                ) : null}
            </div>
        </div>
    )
}

export default YearSection
