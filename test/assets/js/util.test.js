// src/assets/js/util.test.js
const $ = require('jquery');
require('./util.js');

describe('util.js jQuery plugins', () => {
  describe('navList', () => {
    it('should generate indented list of links for nav', () => {
      const nav = $('<ul><li><a href="/home">Home</a></li><li><a href="/about" target="_blank">About</a></li></ul>');
      const result = nav.navList();
      expect(result).toContain('class="link depth-0"');
      expect(result).toContain('href="/home"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('<span class="indent-0"></span>');
      expect(result).toContain('Home');
      expect(result).toContain('About');
    });

    it('should handle nested links with correct depth', () => {
      const nav = $('<ul><li><a href="/top">Top</a><ul><li><a href="/sub">Sub</a></li></ul></li></ul>');
      const result = nav.navList();
      expect(result).toContain('class="link depth-0"');
      expect(result).toContain('class="link depth-1"');
      expect(result).toContain('href="/sub"');
    });

    it('should handle links without href or target', () => {
      const nav = $('<ul><li><a>Plain</a></li></ul>');
      const result = nav.navList();
      expect(result).toContain('class="link depth-0"');
      expect(result).not.toContain('href=');
      expect(result).not.toContain('target=');
    });

    it('should return empty string for nav with no links', () => {
      const nav = $('<ul></ul>');
      expect(nav.navList()).toBe('');
    });
  });

  describe('panel', () => {
    let $panel, $body, $window;

    beforeEach(() => {
      $body = $('body');
      $window = $(window);
      $panel = $('<div id="test-panel"><a href="#test-panel">Toggle</a><a href="/other">Other</a></div>');
      $body.append($panel);
    });

    afterEach(() => {
      $panel.remove();
    });

    it('should return itself for empty selection', () => {
      const empty = $();
      expect(empty.panel()).toBe(empty);
    });

    it('should handle multiple elements', () => {
      const panels = $('<div></div><div></div>');
      expect(panels.panel()).toBe(panels);
    });

    it('should toggle visibleClass on anchor click', () => {
      $panel.panel();
      const toggleLink = $panel.find('a[href="#test-panel"]');
      toggleLink.trigger('click');
      expect($panel.hasClass('visible')).toBe(true);
      toggleLink.trigger('click');
      expect($panel.hasClass('visible')).toBe(false);
    });

    it('should hide panel on body click', () => {
      $panel.panel();
      $panel.addClass('visible');
      $body.trigger('click');
      expect($panel.hasClass('visible')).toBe(false);
    });

    it('should hide panel on ESC if hideOnEscape is true', () => {
      $panel.panel({ hideOnEscape: true });
      $panel.addClass('visible');
      const escEvent = $.Event('keydown', { keyCode: 27 });
      $window.trigger(escEvent);
      expect($panel.hasClass('visible')).toBe(false);
    });

    it('should hide panel on swipe if hideOnSwipe and side are set', () => {
      $panel.panel({ hideOnSwipe: true, side: 'left' });
      $panel.addClass('visible');
      // Simulate touchstart and touchmove for swipe left
      $panel[0].touchPosX = 100;
      $panel[0].touchPosY = 100;
      const touchMoveEvent = $.Event('touchmove', {
        originalEvent: { touches: [{ pageX: 40, pageY: 100 }] }
      });
      $panel.trigger(touchMoveEvent);
      expect($panel.hasClass('visible')).toBe(false);
    });

    it('should prevent event bubbling for panel events', () => {
      $panel.panel();
      const event = $.Event('click');
      const stopSpy = jest.spyOn(event, 'stopPropagation');
      $panel.trigger(event);
      expect(stopSpy).toHaveBeenCalled();
      stopSpy.mockRestore();
    });

    it('should reset scroll and forms on hide if configured', () => {
      $panel.append('<form><input type="text" value="foo" placeholder="bar"></form>');
      $panel.panel({ resetScroll: true, resetForms: true });
      $panel.addClass('visible');
      $panel[0]._hide();
      setTimeout(() => {
        expect($panel.scrollTop()).toBe(0);
        expect($panel.find('input').val()).toBe('');
      }, 10);
    });

    it('should handle click on anchor with href="#id" to hide panel', () => {
      $panel.panel();
      $panel.addClass('visible');
      const anchor = $panel.find('a[href="#test-panel"]');
      anchor.trigger('click');
      expect($panel.hasClass('visible')).toBe(false);
    });

    it('should handle click on anchor with other href', () => {
      $panel.panel({ hideOnClick: true });
      const anchor = $panel.find('a[href="/other"]');
      anchor.trigger('click');
      // Should hide panel and redirect (simulate)
      expect($panel.hasClass('visible')).toBe(false);
    });
  });

  describe('placeholder', () => {
    let $form;

    beforeEach(() => {
      $form = $('<form><input type="text" placeholder="foo" value=""><input type="password" placeholder="bar" value=""><textarea placeholder="baz"></textarea></form>');
      $('body').append($form);
      // Simulate no native placeholder support
      Object.defineProperty(document.createElement('input'), 'placeholder', { value: undefined });
    });

    afterEach(() => {
      $form.remove();
    });

    it('should polyfill text input and textarea placeholders', () => {
      $form.placeholder();
      expect($form.find('input[type=text]').hasClass('polyfill-placeholder')).toBe(true);
      expect($form.find('input[type=text]').val()).toBe('foo');
      expect($form.find('textarea').hasClass('polyfill-placeholder')).toBe(true);
      expect($form.find('textarea').val()).toBe('baz');
    });

    it('should polyfill password input placeholders', () => {
      $form.placeholder();
      const polyfillField = $form.find('input[type=text].polyfill-placeholder');
      expect(polyfillField.length).toBeGreaterThan(0);
      expect(polyfillField.val()).toBe('bar');
    });

    it('should remove placeholder on focus', () => {
      $form.placeholder();
      const input = $form.find('input[type=text]');
      input.trigger('focus');
      expect(input.hasClass('polyfill-placeholder')).toBe(false);
      expect(input.val()).toBe('');
    });

    it('should restore placeholder on blur if empty', () => {
      $form.placeholder();
      const input = $form.find('input[type=text]');
      input.val('');
      input.trigger('blur');
      expect(input.hasClass('polyfill-placeholder')).toBe(true);
      expect(input.val()).toBe('foo');
    });

    it('should handle submit event and clear placeholders', () => {
      $form.placeholder();
      $form.trigger('submit');
      expect($form.find('input[type=text]').val()).toBe('');
      expect($form.find('input[type=text]').hasClass('polyfill-placeholder')).toBe(false);
    });

    it('should handle reset event and restore placeholders', () => {
      $form.placeholder();
      $form.find('input[type=text]').val('');
      $form.trigger('reset');
      expect($form.find('input[type=text]').hasClass('polyfill-placeholder')).toBe(true);
      expect($form.find('input[type=text]').val()).toBe('foo');
    });

    it('should return itself for empty selection', () => {
      const empty = $();
      expect(empty.placeholder()).toBe(empty);
    });

    it('should handle multiple elements', () => {
      const forms = $('<form></form><form></form>');
      expect(forms.placeholder()).toBe(forms);
    });
  });

  describe('prioritize', () => {
    let $parent, $el1, $el2;

    beforeEach(() => {
      $parent = $('<div></div>');
      $el1 = $('<span id="el1"></span>');
      $el2 = $('<span id="el2"></span>');
      $parent.append($el1).append($el2);
      $('body').append($parent);
    });

    afterEach(() => {
      $parent.remove();
    });

    it('should move element to top when condition is true', () => {
      $.prioritize($el2, true);
      expect($parent.children().first().attr('id')).toBe('el2');
    });

    it('should move element back to original position when condition is false', () => {
      $.prioritize($el2, true);
      $.prioritize($el2, false);
      expect($parent.children().eq(1).attr('id')).toBe('el2');
    });

    it('should not move element if already at top', () => {
      $.prioritize($el1, true);
      expect($parent.children().first().attr('id')).toBe('el1');
    });

    it('should handle elements with no parent gracefully', () => {
      const $orphan = $('<span></span>');
      expect(() => $.prioritize($orphan, true)).not.toThrow();
    });

    it('should expand selector to jQuery object', () => {
      $.prioritize('#el2', true);
      expect($parent.children().first().attr('id')).toBe('el2');
    });
  });
});
