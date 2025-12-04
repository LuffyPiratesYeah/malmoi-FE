import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    containerClassName?: string;
}

export function Textarea({
    label,
    className,
    containerClassName,
    ...props
}: TextareaProps) {
    return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
            {label && (
                <label className="text-sm font-medium text-gray-500">
                    {label}
                </label>
            )}
            <textarea
                className={cn(
                    "w-full rounded-md border border-gray-300 bg-transparent p-3 transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    );
}
