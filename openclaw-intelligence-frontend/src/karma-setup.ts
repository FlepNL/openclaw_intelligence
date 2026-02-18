// Karma setup: prevent full page reload warnings in tests
(() => {
  try {
    const loc = window.location;
    Object.defineProperty(loc, 'reload', { value: () => {}, writable: false });
    Object.defineProperty(loc, 'assign', { value: () => {}, writable: false });
    Object.defineProperty(loc, 'replace', { value: () => {}, writable: false });
    try {
      Object.defineProperty(loc, 'href', {
        get: () => '',
        set: () => {},
      });
    } catch {}
  } catch {
    // noop
  }
})();
