// src/assets/js/browser.min.test.js
const browser = require('./browser.min.js');

describe('browser', () => {
  let originalNavigator;
  let originalWindow;
  let originalScreen;

  beforeAll(() => {
    originalNavigator = global.navigator;
    originalWindow = global.window;
    originalScreen = global.screen;
  });

  beforeEach(() => {
    global.navigator = {
      userAgent: '',
      msMaxTouchPoints: 0,
    };
    global.window = {
      ontouchstart: undefined,
    };
    global.screen = {
      width: 1920,
      height: 1080,
    };
    // Reset browser properties
    browser.name = null;
    browser.version = null;
    browser.os = null;
    browser.osVersion = null;
    browser.touch = null;
    browser.mobile = null;
    browser._canUse = null;
  });

  afterAll(() => {
    global.navigator = originalNavigator;
    global.window = originalWindow;
    global.screen = originalScreen;
  });

  describe('canUse', () => {
    it('should return true for supported CSS property', () => {
      expect(browser.canUse('display')).toBe(true);
    });

    it('should return true for vendor-prefixed property', () => {
      expect(browser.canUse('transform')).toBe(true);
    });

    it('should return false for unsupported property', () => {
      expect(browser.canUse('notARealProperty')).toBe(false);
    });

    it('should initialize _canUse div only once', () => {
      browser._canUse = null;
      browser.canUse('color');
      expect(browser._canUse).not.toBeNull();
      const div = browser._canUse;
      browser.canUse('background');
      expect(browser._canUse).toBe(div);
    });
  });

  describe('init (user agent parsing)', () => {
    it('should detect Firefox browser and version', () => {
      global.navigator.userAgent = 'Mozilla/5.0 Firefox/89.0';
      browser.init();
      expect(browser.name).toBe('firefox');
      expect(browser.version).toBe(89);
    });

    it('should detect Chrome browser and version', () => {
      global.navigator.userAgent = 'Mozilla/5.0 Chrome/100.0.4896.127';
      browser.init();
      expect(browser.name).toBe('chrome');
      expect(browser.version).toBe(100);
    });

    it('should detect Safari browser and version', () => {
      global.navigator.userAgent = 'Version/14.0.3 Safari/605.1.15';
      browser.init();
      expect(browser.name).toBe('safari');
      expect(browser.version).toBe(14);
    });

    it('should detect Edge browser and version', () => {
      global.navigator.userAgent = 'Edge/18.18363';
      browser.init();
      expect(browser.name).toBe('edge');
      expect(browser.version).toBe(18.18363);
    });

    it('should detect IE browser and version', () => {
      global.navigator.userAgent = 'MSIE 11';
      browser.init();
      expect(browser.name).toBe('ie');
      expect(browser.version).toBe(11);
    });

    it('should detect Opera browser and version', () => {
      global.navigator.userAgent = 'Opera/75.0';
      browser.init();
      expect(browser.name).toBe('opera');
      expect(browser.version).toBe(75);
    });

    it('should default to "other" for unknown browser', () => {
      global.navigator.userAgent = 'UnknownBrowser/1.0';
      browser.init();
      expect(browser.name).toBe('other');
      expect(browser.version).toBe(0);
    });
  });

  describe('init (OS parsing)', () => {
    it('should detect Android OS and version', () => {
      global.navigator.userAgent = 'Android 10.0 Chrome/100.0.4896.127';
      browser.init();
      expect(browser.os).toBe('android');
      expect(browser.osVersion).toBe(10);
      expect(browser.mobile).toBe(true);
    });

    it('should detect iOS OS and version', () => {
      global.navigator.userAgent = 'iPhone OS 14_2 like Mac OS X';
      global.window.ontouchstart = true;
      global.screen.width = 1024;
      global.screen.height = 1366;
      browser.init();
      expect(browser.os).toBe('ios');
      expect(browser.osVersion).toBe(14.2);
      expect(browser.mobile).toBe(true);
    });

    it('should detect Windows OS and version', () => {
      global.navigator.userAgent = 'Windows NT 10.0';
      browser.init();
      expect(browser.os).toBe('windows');
      expect(browser.osVersion).toBe(10);
      expect(browser.mobile).toBe(false);
    });

    it('should detect Mac OS and version', () => {
      global.navigator.userAgent = 'Macintosh Mac OS X 10_15_7';
      browser.init();
      expect(browser.os).toBe('mac');
      expect(browser.osVersion).toBe(10.15);
      expect(browser.mobile).toBe(false);
    });

    it('should detect Linux OS', () => {
      global.navigator.userAgent = 'Linux';
      browser.init();
      expect(browser.os).toBe('linux');
      expect(browser.osVersion).toBe(0);
      expect(browser.mobile).toBe(false);
    });

    it('should detect BSD OS', () => {
      global.navigator.userAgent = 'BSD';
      browser.init();
      expect(browser.os).toBe('bsd');
      expect(browser.osVersion).toBe(0);
      expect(browser.mobile).toBe(false);
    });

    it('should detect Unix OS', () => {
      global.navigator.userAgent = 'X11';
      browser.init();
      expect(browser.os).toBe('unix');
      expect(browser.osVersion).toBe(0);
      expect(browser.mobile).toBe(false);
    });

    it('should default to "other" for unknown OS', () => {
      global.navigator.userAgent = 'UnknownOS/1.0';
      browser.init();
      expect(browser.os).toBe('other');
      expect(browser.osVersion).toBe(0);
      expect(browser.mobile).toBe(false);
    });
  });

  describe('touch and mobile detection', () => {
    it('should detect touch for iOS', () => {
      global.navigator.userAgent = 'iPhone OS 14_2 like Mac OS X';
      global.window.ontouchstart = true;
      browser.init();
      expect(browser.touch).toBe(true);
      expect(browser.mobile).toBe(true);
    });

    it('should detect touch for Windows Phone', () => {
      global.navigator.userAgent = 'Windows Phone 8.1';
      global.navigator.msMaxTouchPoints = 2;
      browser.init();
      expect(browser.touch).toBe(true);
      expect(browser.mobile).toBe(true);
    });

    it('should detect no touch for desktop', () => {
      global.navigator.userAgent = 'Windows NT 10.0';
      global.window.ontouchstart = undefined;
      browser.init();
      expect(browser.touch).toBe(false);
      expect(browser.mobile).toBe(false);
    });
  });

  describe('error scenarios', () => {
    it('should not throw if userAgent is missing', () => {
      global.navigator.userAgent = undefined;
      expect(() => browser.init()).not.toThrow();
      expect(browser.name).toBe('other');
    });

    it('should not throw if window is missing', () => {
      const oldWindow = global.window;
      global.window = undefined;
      global.navigator.userAgent = 'Macintosh Mac OS X 10_15_7';
      expect(() => browser.init()).not.toThrow();
      global.window = oldWindow;
    });

    it('should not throw if screen is missing', () => {
      const oldScreen = global.screen;
      global.screen = undefined;
      global.navigator.userAgent = 'iPhone OS 14_2 like Mac OS X';
      expect(() => browser.init()).not.toThrow();
      global.screen = oldScreen;
    });
  });
});
