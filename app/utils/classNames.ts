// app/utils/classNames.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes with clsx
 */
export function classNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
