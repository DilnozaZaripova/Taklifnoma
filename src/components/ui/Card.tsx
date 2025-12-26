import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

// We extend HTMLMotionProps to allow animation props if needed directly
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
    glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
    className,
    hoverEffect = false,
    glass = true,
    children,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-3xl relative overflow-hidden",
                glass ? "glass" : "bg-white border border-[var(--border)] shadow-[var(--shadow-soft)]",
                hoverEffect ? "hover:translate-y-[-4px] hover:shadow-[var(--shadow-luxury)] transition-all duration-500 ease-out cursor-default" : "",
                className
            )}
            {...props}
        >
            {/* Optional subtle noise texture overlay for the card itself */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-noise" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
});

Card.displayName = "Card";

export default Card;
