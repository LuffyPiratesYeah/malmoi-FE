import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    variant?: "underline" | "box";
    containerClassName?: string;
}

export function Input({
    label,
    variant = "underline",
    className,
    containerClassName,
    ...props
}: InputProps) {
    return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
            {label && (
                <label className="text-sm font-medium text-gray-500">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full bg-transparent py-2 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    variant === "underline" && "border-b border-gray-300 focus:border-primary placeholder:text-gray-300",
                    variant === "box" && "border border-gray-300 rounded-md px-3 focus:border-primary",
                    className
                )}
                {...props}
            />
        </div>
    );
}
