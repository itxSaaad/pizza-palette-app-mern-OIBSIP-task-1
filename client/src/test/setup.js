import '@testing-library/jest-dom';

// Node 25 exposes its own experimental localStorage global. Pin tests to a
// deterministic browser-like storage implementation instead of inheriting
// whichever Node global the selected runtime provides.
const createMemoryStorage = () => {
  const values = new Map();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.has(String(key)) ? values.get(String(key)) : null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      values.delete(String(key));
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
  };
};

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: createMemoryStorage(),
});
