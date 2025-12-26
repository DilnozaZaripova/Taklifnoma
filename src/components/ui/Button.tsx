'use client';

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = "font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-[var(--primary)] text-white hover:shadow-lg hover:shadow-[var(--primary)]/20",
            outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
            ghost: "text-[var(--primary)] hover:bg-[var(--primary)]/10"
        };

        const sizes = {
            sm: "px-4 py-2 text-sm rounded-full",
            md: "px-6 py-3 text-base rounded-full",
            lg: "px-8 py-4 text-lg rounded-full"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
