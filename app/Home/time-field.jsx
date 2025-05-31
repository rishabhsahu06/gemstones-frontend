"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const TimeField = React.forwardRef(({ value, onChange, className, ...props }, ref) => {
    const [timeValue, setTimeValue] = React.useState(value || { hours: 0, minutes: 0, seconds: 0 })

    const handleChange = (newValue) => {
        setTimeValue(newValue)
        if (onChange) {
            onChange(newValue)
        }
    }

    return (
        <div ref={ref} className={cn("flex items-center border rounded-md overflow-hidden", className)} {...props}>
            <TimeSegment
                value={timeValue.hours}
                onChange={(hours) => handleChange({ ...timeValue, hours })}
                max={23}
                format={(val) => val.toString().padStart(2, "0")}
            />
            <span className="text-center px-1">:</span>
            <TimeSegment
                value={timeValue.minutes}
                onChange={(minutes) => handleChange({ ...timeValue, minutes })}
                max={59}
                format={(val) => val.toString().padStart(2, "0")}
            />
            <span className="text-center px-1">:</span>
            <TimeSegment
                value={timeValue.seconds || 0}
                onChange={(seconds) => handleChange({ ...timeValue, seconds })}
                max={59}
                format={(val) => val.toString().padStart(2, "0")}
            />
        </div>
    )
})
TimeField.displayName = "TimeField"

const TimeSegment = ({ value, onChange, max, format }) => {
    const increment = () => {
        onChange(value === max ? 0 : value + 1)
    }

    const decrement = () => {
        onChange(value === 0 ? max : value - 1)
    }

    return (
        <div className="flex flex-col items-center">
            <button type="button" onClick={increment} className="p-1 hover:bg-gray-100 focus:outline-none">
                <ChevronUp className="h-3 w-3" />
            </button>
            <div className="w-8 text-center">{format(value)}</div>
            <button type="button" onClick={decrement} className="p-1 hover:bg-gray-100 focus:outline-none">
                <ChevronDown className="h-3 w-3" />
            </button>
        </div>
    )
}

export { TimeField }
