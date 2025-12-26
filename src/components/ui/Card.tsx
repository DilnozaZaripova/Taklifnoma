'use client';

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl border border-[var(--border)] p-6",
                    glass && "glass",
                    "shadow-[var(--shadow-soft)]",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export default Card;
