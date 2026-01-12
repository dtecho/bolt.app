import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

// Setup DOM cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock WebContainer API
beforeAll(() => {
  // Mock WebContainer for testing
  global.WebContainer = {
    boot: vi.fn().mockResolvedValue({
      mount: vi.fn(),
      spawn: vi.fn(),
      fs: {
        writeFile: vi.fn(),
        readFile: vi.fn(),
        readdir: vi.fn(),
      },
    }),
  };

  // Mock Anthropic API
  global.fetch = vi.fn();

  // Mock QR code generation
  vi.mock("qrcode", () => ({
    default: {
      toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mock-qr-code"),
    },
  }));
});

// Mock browser APIs
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;