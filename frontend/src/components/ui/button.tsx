import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'btn-ripple inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-800/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-800 text-white hover:bg-primary-900 shadow-soft hover:shadow-medium hover:-translate-y-0.5',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-soft hover:shadow-medium',
        outline: 'border-2 border-neutral-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-primary-800/30 text-neutral-700 hover:text-primary-800 hover:shadow-soft',
        secondary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-soft hover:shadow-medium hover:-translate-y-0.5',
        ghost: 'hover:bg-primary-800/8 text-neutral-600 hover:text-primary-800',
        link: 'text-primary-800 underline-offset-4 hover:underline decoration-primary-800/30',
        gradient: 'gradient-primary text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5',
        premium: 'relative overflow-hidden bg-white text-primary-800 border-2 border-primary-800/20 hover:border-primary-800/40 shadow-soft hover:shadow-glow hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-800/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        'gradient-accent': 'gradient-accent text-white shadow-soft hover:shadow-glow-accent hover:-translate-y-0.5',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 rounded-[10px] px-4 text-xs',
        lg: 'h-12 rounded-[14px] px-8 text-base',
        xl: 'h-14 rounded-[16px] px-10 text-lg font-semibold',
        icon: 'h-10 w-10 rounded-[10px]',
        'icon-lg': 'h-12 w-12 rounded-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2.5">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
        {variant === 'gradient' && (
          <span className="absolute inset-0 rounded-[12px] bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
