/**
 * @file v2.test.js
 * Tests for src/scripts/v2.js
 */

import fs from 'fs';
import path from 'path';

const V2_PATH = path.resolve(__dirname, '../src/scripts/v2.js');
let v2Code = '';

beforeAll(() => {
  v2Code = fs.readFileSync(V2_PATH, 'utf8');
  // Evaluate the script in the JSDOM context
  // eslint-disable-next-line no-eval
  eval(v2Code);
});

describe('setRandomBackground', () => {
  let originalGetElementById;
  let bgDiv;
  let imageMock;
  let originalImage;

  beforeEach(() => {
    // Mock document.getElementById
    bgDiv = { style: { backgroundImage: '' } };
    originalGetElementById = global.document.getElementById;
    global.document.getElementById = jest.fn((id) => (id === 'bg' ? bgDiv : null));

    // Mock Image
    imageMock = {
      set src(val) {
        // Simulate successful load for the first image
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      },
      set onload(fn) {
        this._onload = fn;
      },
      get onload() {
        return this._onload;
      },
      set onerror(fn) {
        this._onerror = fn;
      },
      get onerror() {
        return this._onerror;
      },
    };
    originalImage = global.Image;
    global.Image = jest.fn(() => imageMock);
  });

  afterEach(() => {
    global.document.getElementById = originalGetElementById;
    global.Image = originalImage;
    jest.clearAllMocks();
  });

  it('sets a random background image when bg element exists', (done) => {
    setRandomBackground();
    setTimeout(() => {
      expect(bgDiv.style.backgroundImage).toMatch(/^url\("images\//);
      done();
    }, 10);
  });

  it('does nothing if bg element does not exist', () => {
    global.document.getElementById = jest.fn(() => null);
    expect(() => setRandomBackground()).not.toThrow();
  });

  it('tries next image on error until one loads', (done) => {
    let callCount = 0;
    global.Image = jest.fn(() => {
      callCount++;
      return {
        set src(val) {
          if (callCount < 2) {
            setTimeout(() => {
              if (this.onerror) this.onerror();
            }, 0);
          } else {
            setTimeout(() => {
              if (this.onload) this.onload();
            }, 0);
          }
        },
        set onload(fn) {
          this._onload = fn;
        },
        get onload() {
          return this._onload;
        },
        set onerror(fn) {
          this._onerror = fn;
        },
        get onerror() {
          return this._onerror;
        },
      };
    });
    setRandomBackground();
    setTimeout(() => {
      expect(bgDiv.style.backgroundImage).toMatch(/^url\("images\//);
      expect(callCount).toBeGreaterThan(1);
      done();
    }, 20);
  });
});

describe('initEntranceAnimations', () => {
  let originalQuerySelectorAll;
  let observerCallback;
  let observedCards = [];

  beforeEach(() => {
    observedCards = [];
    originalQuerySelectorAll = global.document.querySelectorAll;
    global.document.querySelectorAll = jest.fn((selector) => {
      if (selector === '.section-card') {
        return [
          { classList: { add: jest.fn() }, id: 'card1' },
          { classList: { add: jest.fn() }, id: 'card2' },
        ];
      }
      return [];
    });

    global.IntersectionObserver = jest.fn((cb) => {
      observerCallback = cb;
      return {
        observe: (el) => observedCards.push(el),
        unobserve: jest.fn(),
      };
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    global.document.querySelectorAll = originalQuerySelectorAll;
    jest.useRealTimers();
  });

  it('observes all section cards and adds visible class on intersection', () => {
    initEntranceAnimations();
    expect(observedCards.length).toBe(2);

    // Simulate both cards intersecting
    observerCallback(
      [
        { isIntersecting: true, target: observedCards[0] },
        { isIntersecting: true, target: observedCards[1] },
      ],
      0
    );
    jest.advanceTimersByTime(160);
    expect(observedCards[0].classList.add).toHaveBeenCalledWith('visible');
    expect(observedCards[1].classList.add).toHaveBeenCalledWith('visible');
  });

  it('does nothing if no section cards exist', () => {
    global.document.querySelectorAll = jest.fn(() => []);
    expect(() => initEntranceAnimations()).not.toThrow();
  });

  it('does not add visible class if not intersecting', () => {
    initEntranceAnimations();
    observerCallback([{ isIntersecting: false, target: observedCards[0] }], 0);
    jest.advanceTimersByTime(100);
    expect(observedCards[0].classList.add).not.toHaveBeenCalled();
  });
});

describe('initNavHighlight', () => {
  let originalQuerySelectorAll;
  let observerCallback;
  let observedSections = [];
  let navLinks = [];

  beforeEach(() => {
    observedSections = [
      { id: 'sec1' },
      { id: 'sec2' },
    ];
    navLinks = [
      { getAttribute: jest.fn(() => '#sec1'), classList: { toggle: jest.fn() } },
      { getAttribute: jest.fn(() => '#sec2'), classList: { toggle: jest.fn() } },
    ];
    originalQuerySelectorAll = global.document.querySelectorAll;
    global.document.querySelectorAll = jest.fn((selector) => {
      if (selector === '.section-card[id]') return observedSections;
      if (selector === '#top-bar nav a[href^="#"]') return navLinks;
      return [];
    });

    global.IntersectionObserver = jest.fn((cb) => {
      observerCallback = cb;
      return {
        observe: (el) => {},
        unobserve: jest.fn(),
      };
    });
  });

  afterEach(() => {
    global.document.querySelectorAll = originalQuerySelectorAll;
  });

  it('observes all sections and toggles active class on nav links', () => {
    initNavHighlight();
    observerCallback([{ isIntersecting: true, target: observedSections[0] }]);
    expect(navLinks[0].classList.toggle).toHaveBeenCalledWith('active', true);
    expect(navLinks[1].classList.toggle).toHaveBeenCalledWith('active', false);
  });

  it('does nothing if no sections or nav links exist', () => {
    global.document.querySelectorAll = jest.fn(() => []);
    expect(() => initNavHighlight()).not.toThrow();
  });

  it('does not toggle if not intersecting', () => {
    initNavHighlight();
    observerCallback([{ isIntersecting: false, target: observedSections[0] }]);
    expect(navLinks[0].classList.toggle).not.toHaveBeenCalled();
    expect(navLinks[1].classList.toggle).not.toHaveBeenCalled();
  });
});

describe('initContactForm', () => {
  let originalGetElementById;
  let form;
  let submitHandler;

  beforeEach(() => {
    form = {
      addEventListener: jest.fn((event, handler) => {
        if (event === 'submit') submitHandler = handler;
      }),
      innerHTML: '',
    };
    originalGetElementById = global.document.getElementById;
    global.document.getElementById = jest.fn((id) => (id === 'contact-form' ? form : null));
  });

  afterEach(() => {
    global.document.getElementById = originalGetElementById;
  });

  it('adds submit event listener and shows thank you message on submit', () => {
    initContactForm();
    expect(form.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
    const preventDefault = jest.fn();
    submitHandler({ preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(form.innerHTML).toMatch(/Obrigado pela mensagem/);
  });

  it('does nothing if contact form does not exist', () => {
    global.document.getElementById = jest.fn(() => null);
    expect(() => initContactForm()).not.toThrow();
  });
});

describe('DOMContentLoaded boot', () => {
  let addEventListenerSpy;
  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(document, 'addEventListener');
  });
  afterEach(() => {
    addEventListenerSpy.mockRestore();
  });

  it('registers DOMContentLoaded event', () => {
    // The script registers the event on load
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.any(Function)
    );
  });
});
