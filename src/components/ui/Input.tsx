import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    className,
    label,
    error,
    icon,
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="text-sm font-medium text-[var(--foreground)] ml-1 tracking-wide">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors duration-300">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-base ring-offset-white transition-all duration-300",
                        "placeholder:text-[var(--muted-foreground)]/50",
                        "focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-4 focus-visible:ring-[var(--primary)]/10",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "hover:border-[var(--primary)]/50",
                        "shadow-sm hover:shadow-md focus:shadow-lg",
                        icon ? "pl-12" : "",
                        error ? "border-red-500 focus-visible:ring-red-100" : "",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500 ml-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
