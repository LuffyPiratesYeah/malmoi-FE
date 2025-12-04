import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, size = "md" }: LogoProps) {
    const sizes = {
        sm: { width: 80, height: 44 },
        md: { width: 126, height: 70 },
        lg: { width: 180, height: 100 },
        xl: { width: 240, height: 133 },
    };

    const { width, height } = sizes[size];

    return (
        <div className={cn("relative", className)}>
            <Image
                src="/logo.svg"
                alt="Malmoi Logo"
                width={width}
                height={height}
                priority
            />
        </div>
    );
}

