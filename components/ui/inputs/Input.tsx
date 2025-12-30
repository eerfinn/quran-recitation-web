import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, icon, iconPosition = 'left', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-200",
                            iconPosition === 'left' ? "left-3" : "right-3",
                            props.disabled && "opacity-50"
                        )}>
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white',
                            'placeholder:text-gray-400 font-medium transition-all duration-200',
                            'hover:border-gray-300',
                            icon && iconPosition === 'left' && 'pl-10',
                            icon && iconPosition === 'right' && 'pr-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500 ml-1 font-medium animate-slide-down">{error}</p>}
                {helperText && !error && (
                    <p className="text-sm text-gray-500 mt-1 ml-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
