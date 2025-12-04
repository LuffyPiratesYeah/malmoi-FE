import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

export function Card({ children, className, title, subtitle }: CardProps) {
    return (
        <div className={cn("rounded-2xl border border-gray-200 bg-white p-6 shadow-sm", className)}>
            {(title || subtitle) && (
                <div className="mb-6">
                    {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
}
