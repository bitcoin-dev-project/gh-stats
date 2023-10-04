"use client"

type SpinnerProps = {
    size?: "small" | "large"
}

const Spinner = ({ size = "small" }: SpinnerProps) => {
    const height = size === "small" ? "h-6" : "h-16"
    const width = size === "small" ? "w-6" : "w-16"
    const borderTop = size === "small" ? "border-t-2" : "border-t-4"

    return (
        <div
            className={`${height} ${width} border ${borderTop} border-green-300 border-solid rounded-full animate-spin`}
        ></div>
    )
}

export default Spinner
