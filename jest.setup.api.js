// Jest setup file for API tests (Node environment)

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