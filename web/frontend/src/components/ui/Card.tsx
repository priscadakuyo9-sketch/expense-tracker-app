import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Card = ({ className, ...props }: CardProps) => (
    <div
        className={cn(
            'rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/5',
            className
        )}
        {...props}
    />
);

export const CardHeader = ({ className, ...props }: CardProps) => (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: CardProps) => (
    <h3
        className={cn('text-lg font-bold leading-none tracking-tight text-white', className)}
        {...props}
    />
);

export const CardDescription = ({ className, ...props }: CardProps) => (
    <p className={cn('text-sm text-zinc-400', className)} {...props} />
);

export const CardContent = ({ className, ...props }: CardProps) => (
    <div className={cn('p-6 pt-0', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: CardProps) => (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

