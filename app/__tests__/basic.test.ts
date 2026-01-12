// app/__tests__/basic.test.ts

import { describe, it, expect } from 'vitest';

describe('Basic Tests', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify project configuration', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
