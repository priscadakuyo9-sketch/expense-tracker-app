import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all',
            secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:scale-95 transition-all',
            outline: 'border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all',
            ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all',
            danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm rounded-lg',
            md: 'px-4 py-2 rounded-xl',
            lg: 'px-6 py-3 text-lg rounded-2xl',
            icon: 'p-2 rounded-full',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

