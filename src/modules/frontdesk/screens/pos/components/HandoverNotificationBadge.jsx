import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

/**
 * Handover Notification Badge
 * Shows the count of pending handovers with pulse animation
 */
export default function HandoverNotificationBadge({ count = 0, onClick }) {
    const [prevCount, setPrevCount] = useState(count);
    const [shouldPulse, setShouldPulse] = useState(false);

    // Trigger pulse animation when count increases
    useEffect(() => {
        if (count > prevCount && count > 0) {
            setShouldPulse(true);
            const timer = setTimeout(() => setShouldPulse(false), 2000);
            return () => clearTimeout(timer);
        }
        setPrevCount(count);
    }, [count, prevCount]);

    if (count === 0) return null;

    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                "bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white",
                "border border-orange-500/20 hover:border-orange-500",
                "text-xs font-bold uppercase tracking-wider",
                shouldPulse && "animate-pulse"
            )}
            title="View Pending Handovers"
        >
            <Bell size={16} className={shouldPulse ? "animate-bounce" : ""} />
            <span>Handovers</span>
            <span
                className={cn(
                    "flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full",
                    "bg-orange-500 text-white text-[10px] font-black",
                    shouldPulse && "animate-ping"
                )}
            >
                {count}
            </span>
        </button>
    );
}
