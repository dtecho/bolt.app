// app/utils/easings.ts

/**
 * Cubic bezier easing function for smooth animations
 */
export const cubicEasingFn = [0.4, 0, 0.2, 1] as const;

/**
 * Ease in easing function
 */
export const easeIn = [0.4, 0, 1, 1] as const;

/**
 * Ease out easing function
 */
export const easeOut = [0, 0, 0.2, 1] as const;

/**
 * Ease in-out easing function
 */
export const easeInOut = [0.4, 0, 0.2, 1] as const;
