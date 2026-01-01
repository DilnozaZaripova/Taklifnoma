import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

// Combining standard button props with motion props
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
};

// We wrap the standard button with motion for hover effects
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    disabled,
    ...props
}, ref) => {

    const variants = {
        primary: "btn-luxe", // Defined in globals.css
        outline: "btn-outline-luxe", // Defined in globals.css
        ghost: "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)]/50 transition-colors duration-300 font-medium",
    };

    const sizes = {
        sm: "text-sm px-6 py-2.5",
        md: "text-base px-8 py-3.5",
        lg: "text-lg px-10 py-4",
    };

    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
                "inline-flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer active:scale-[0.98]",
                variants[variant],
                variant === 'ghost' ? sizes[size] : "", // btn-luxe handles its own padding, usually
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
