import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | "gray";
    className?: string;
}

export function Badge({ children, variant = "primary", className }: BadgeProps) {
    const variants = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary text-white",
        outline: "border border-gray-200 text-gray-600",
        gray: "bg-gray-100 text-gray-600",
    };

    return (
        <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
}
