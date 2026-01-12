// app/components/ui/Slider.tsx

import { classNames } from '~/utils/classNames';

interface SliderOption {
  value: string;
  text: string;
}

interface SliderProps {
  selected: string;
  options: {
    left: SliderOption;
    center: SliderOption;
    right: SliderOption;
  };
  onChange: (value: string) => void;
  className?: string;
}

export function Slider({ selected, options, onChange, className }: SliderProps) {
  return (
    <div className={classNames('flex gap-1 p-1 bg-bolt-elements-background-depth-2 rounded-lg', className)}>
      <button
        onClick={() => onChange(options.left.value)}
        className={classNames(
          'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
          selected === options.left.value
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
            : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
        )}
      >
        {options.left.text}
      </button>
      <button
        onClick={() => onChange(options.center.value)}
        className={classNames(
          'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
          selected === options.center.value
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
            : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
        )}
      >
        {options.center.text}
      </button>
      <button
        onClick={() => onChange(options.right.value)}
        className={classNames(
          'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
          selected === options.right.value
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
            : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
        )}
      >
        {options.right.text}
      </button>
    </div>
  );
}
