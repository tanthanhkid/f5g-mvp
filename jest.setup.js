// Jest setup file
require('@testing-library/jest-dom')

// Mock environment variables
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

// Mock NextRequest và NextResponse
global.Headers = class Headers {
  constructor(init) {
    this.headers = new Map();
    if (init) {
      for (const [key, value] of Object.entries(init)) {
        this.headers.set(key, value);
      }
    }
  }
  
  get(name) {
    return this.headers.get(name.toLowerCase());
  }
  
  set(name, value) {
    this.headers.set(name.toLowerCase(), value);
  }
};

// Mock fetch for Node.js environment
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data: [] }),
  })
);

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
} 