'use client';

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]",
                        "transition-all duration-200",
                        "placeholder:text-[var(--muted-foreground)]",
                        error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
