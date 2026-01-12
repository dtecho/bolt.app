// app/components/ui/IconButton.tsx

import { classNames } from '~/utils/classNames';

interface IconButtonProps {
  icon?: React.ReactNode;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function IconButton({
  icon,
  title,
  onClick,
  disabled,
  className,
  size = 'md',
  children,
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'inline-flex items-center justify-center rounded-lg',
        'bg-bolt-elements-background-depth-2',
        'text-bolt-elements-textPrimary',
        'hover:bg-bolt-elements-background-depth-3',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-150',
        sizeClasses[size],
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}
