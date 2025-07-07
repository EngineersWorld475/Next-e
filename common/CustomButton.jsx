import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomButton = ({
  variant = 'default', 
  size = 'default', 
  icon: Icon,
  iconPosition = 'left',
  children,
  disabled = false,
  loading = false,
  onClick,
  className,
  asChild = false,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = fullWidth ? 'w-full sm:w-auto' : '';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:hover:border-gray-500',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg',
    redGradient: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg',
    purpleGradient: 'bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white'
  };
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    lg: 'h-11 px-6 text-base',
    default: 'h-10 px-4 text-sm',
  };

  const buttonStyles = cn(
    baseStyles,
    variantStyles[variant] || variantStyles.default,
    sizeStyles[size] || sizeStyles.default,
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  return (
    <Button
      variant={variant === 'outline' ? 'outline' : 'default'}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonStyles}
      asChild={asChild}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              {children && <span>{children}</span>}
            </>
          ) : (
            <>
              {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
              {children && <span>{children}</span>}
              {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
            </>
          )}
        </div>
      )}
    </Button>
  );
};

export default CustomButton;