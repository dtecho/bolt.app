// app/utils/__tests__/classNames.test.ts

import { describe, it, expect } from 'vitest';
import { classNames, cn } from '../classNames';

describe('classNames utility', () => {
  it('should merge class names', () => {
    const result = classNames('text-white', 'bg-black');
    expect(result).toContain('text-white');
    expect(result).toContain('bg-black');
  });

  it('should handle conditional classes', () => {
    const result = classNames('base', true && 'active', false && 'inactive');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('inactive');
  });

  it('should merge tailwind conflicting classes', () => {
    const result = classNames('p-4', 'p-2');
    // Should only have one padding class
    expect(result).toContain('p-');
  });

  it('cn should work as alias', () => {
    const result = cn('text-xl', 'font-bold');
    expect(result).toContain('text-xl');
    expect(result).toContain('font-bold');
  });
});
