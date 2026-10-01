// src/assets/js/breakpoints.min.test.js
const breakpoints = require('./breakpoints.min.js');

describe('breakpoints', () => {
  let originalMatchMedia;
  let matchMediaMock;

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
  });

  beforeEach(() => {
    matchMediaMock = jest.fn().mockImplementation(query => ({
      matches: query.includes('min-width: 800px') || query.includes('max-width: 1200px'),
    }));
    window.matchMedia = matchMediaMock;
    // Reset breakpoints internal state
    breakpoints._.list = null;
    breakpoints._.media = {};
    breakpoints._.events = [];
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  describe('init', () => {
    it('should initialize breakpoints and attach event listeners', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      breakpoints._.init({ desktop: ['800px', '1200px'] });
      expect(breakpoints._.list).toEqual({ desktop: ['800px', '1200px'] });
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', breakpoints._.poll);
      expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', breakpoints._.poll);
      expect(addEventListenerSpy).toHaveBeenCalledWith('load', breakpoints._.poll);
      expect(addEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', breakpoints._.poll);
      addEventListenerSpy.mockRestore();
    });
  });

  describe('active', () => {
    beforeEach(() => {
      breakpoints._.init({
        desktop: ['800px', '1200px'],
        mobile: ['320px', '480px'],
        custom: ['1000px', ''],
        eq: '(min-width: 900px)',
        empty: ['', ''],
      });
    });

    it('should return true for a matching breakpoint (happy path)', () => {
      expect(breakpoints.active('desktop')).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('screen and (min-width: 800px) and (max-width: 1200px)');
    });

    it('should handle >=, <=, >, <, ! operators', () => {
      expect(breakpoints.active('>=desktop')).toBe(true);
      expect(breakpoints.active('<=desktop')).toBe(true);
      expect(breakpoints.active('>desktop')).toBe(true);
      expect(breakpoints.active('<desktop')).toBe(true);
      expect(breakpoints.active('!desktop')).toBe(true);
    });

    it('should handle breakpoints with only min-width', () => {
      expect(breakpoints.active('custom')).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('screen and (min-width: 1000px)');
    });

    it('should handle breakpoints with only a media query string', () => {
      expect(breakpoints.active('eq')).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('screen and (min-width: 900px)');
    });

    it('should return false for unknown breakpoint', () => {
      expect(breakpoints.active('unknown')).toBe(false);
    });

    it('should handle empty breakpoint gracefully', () => {
      expect(breakpoints.active('empty')).toBe(false);
    });

    it('should cache media queries after first call', () => {
      breakpoints.active('desktop');
      expect(breakpoints._.media['desktop']).toBe('screen and (min-width: 800px) and (max-width: 1200px)');
    });

    it('should handle invalid breakpoint values', () => {
      breakpoints._.init({ bad: ['not-a-number', 'also-not-a-number'] });
      expect(breakpoints.active('bad')).toBe(false);
    });
  });

  describe('on', () => {
    beforeEach(() => {
      breakpoints._.init({
        desktop: ['800px', '1200px'],
        mobile: ['320px', '480px'],
      });
    });

    it('should call handler immediately if breakpoint is active', () => {
      const handler = jest.fn();
      breakpoints.on('desktop', handler);
      expect(handler).toHaveBeenCalled();
    });

    it('should not call handler if breakpoint is inactive', () => {
      matchMediaMock.mockReturnValueOnce({ matches: false });
      const handler = jest.fn();
      breakpoints.on('mobile', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should add event to events array', () => {
      const handler = jest.fn();
      breakpoints.on('desktop', handler);
      expect(breakpoints._.events.length).toBe(1);
      expect(breakpoints._.events[0]).toMatchObject({ query: 'desktop', handler, state: true });
    });
  });

  describe('poll', () => {
    beforeEach(() => {
      breakpoints._.init({
        desktop: ['800px', '1200px'],
        mobile: ['320px', '480px'],
      });
    });

    it('should call handler when breakpoint becomes active', () => {
      const handler = jest.fn();
      breakpoints.on('mobile', handler);
      breakpoints._.events[0].state = false;
      matchMediaMock.mockReturnValueOnce({ matches: true });
      breakpoints._.poll();
      expect(handler).toHaveBeenCalled();
      expect(breakpoints._.events[0].state).toBe(true);
    });

    it('should reset state when breakpoint becomes inactive', () => {
      const handler = jest.fn();
      breakpoints.on('desktop', handler);
      breakpoints._.events[0].state = true;
      matchMediaMock.mockReturnValueOnce({ matches: false });
      breakpoints._.poll();
      expect(breakpoints._.events[0].state).toBe(false);
    });
  });

  describe('error scenarios', () => {
    it('should not throw when matchMedia is missing', () => {
      window.matchMedia = undefined;
      breakpoints._.init({ desktop: ['800px', '1200px'] });
      expect(() => breakpoints.active('desktop')).not.toThrow();
    });

    it('should not throw when list is null', () => {
      breakpoints._.list = null;
      expect(() => breakpoints.active('desktop')).not.toThrow();
    });
  });
});
