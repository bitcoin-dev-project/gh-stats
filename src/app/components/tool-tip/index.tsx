import React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { Contribution } from "@/types"
import { boxColor } from "@/helpers/utils"

const ToolTip = ({
    content,
    onClickToolTip,
    loading
}: {
    content: Contribution
    onClickToolTip: (content: Contribution) => void
    loading: boolean
}) => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button onClick={() => onClickToolTip(content)}>
                        <p
                            className={`rounded-sm p-1 h-[10px] w-[10px] cursor-pointer ${
                                loading ? "animate-pulse" : "animate-none"
                            }`}
                            style={{ backgroundColor: boxColor(content) }}
                        ></p>
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="TooltipContent" sideOffset={5}>
                        <p className="p-4 py-[8px] rounded text-[12px] bg-secondary-blue text-white shadow-sm">
                            {content.desc}
                        </p>
                        <Tooltip.Arrow className="TooltipArrow" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}

export default ToolTip
