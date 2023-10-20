import React from "react"

const Skeleton = () => {
    return (
        <div className="border-2 w-full h-[166px] rounded p-3 flex gap-2 flex-col animate-pulse shadow-card-light-black">
            <p className=" bg-slate-200 h-2 rounded"></p>
            <p className=" bg-slate-200 h-2 rounded"></p>
            <p className="h-2 bg-slate-300 w-96 rounded mt-2"></p>
            <section className="h-[60px] bg-slate-300 rounded"></section>
            <p className="h-2 bg-slate-300 w-32 rounded"></p>
        </div>
    )
}

export default Skeleton
