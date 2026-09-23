class InputHandler {
  constructor() {
    this.keys = {};
    this.keyPresses = {};

    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.keyPresses[e.code] = true;
      }
      this.keys[e.code] = true;
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Touch controls setup
    this.setupTouchControls();
  }

  isDown(code) {
    return !!this.keys[code];
  }

  isPressed(code) {
    const pressed = !!this.keyPresses[code];
    this.keyPresses[code] = false;
    return pressed;
  }

  get left() {
    return this.isDown('ArrowLeft') || this.isDown('KeyA') || this.touchLeft;
  }

  get right() {
    return this.isDown('ArrowRight') || this.isDown('KeyD') || this.touchRight;
  }

  get jump() {
    return this.isDown('Space') || this.isDown('ArrowUp') || this.isDown('KeyW') || this.touchJump;
  }

  get switchPressed() {
    return this.isPressed('KeyC') || this.touchSwitchPressed;
  }

  setupTouchControls() {
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.touchSwitchPressed = false;

    const bindBtn = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;

      const handleDown = (e) => {
        if (e.cancelable) e.preventDefault();
        el.classList.add('active');
        onDown();
      };

      const handleUp = (e) => {
        if (e && e.cancelable) e.preventDefault();
        el.classList.remove('active');
        onUp();
      };

      // Pointer events for modern multi-touch
      el.addEventListener('pointerdown', (e) => {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        handleDown(e);
      });
      el.addEventListener('pointerup', (e) => {
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        handleUp(e);
      });
      el.addEventListener('pointercancel', (e) => {
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        handleUp(e);
      });

      // Fallback touch events
      el.addEventListener('touchstart', handleDown, { passive: false });
      el.addEventListener('touchend', handleUp, { passive: false });
      el.addEventListener('touchcancel', handleUp, { passive: false });
    };

    bindBtn('btn-touch-left', () => this.touchLeft = true, () => this.touchLeft = false);
    bindBtn('btn-touch-right', () => this.touchRight = true, () => this.touchRight = false);
    bindBtn('btn-touch-jump', () => this.touchJump = true, () => this.touchJump = false);
    bindBtn('btn-touch-switch', () => this.touchSwitchPressed = true, () => this.touchSwitchPressed = false);
    
    // Also bind alternative IDs if used in different layouts (e.g. btnTouchA, btnTouchLeft, etc.)
    bindBtn('btnTouchLeft', () => this.touchLeft = true, () => this.touchLeft = false);
    bindBtn('btnTouchRight', () => this.touchRight = true, () => this.touchRight = false);
    bindBtn('btnTouchA', () => this.touchJump = true, () => this.touchJump = false);
    bindBtn('btnTouchSwitch', () => this.touchSwitchPressed = true, () => this.touchSwitchPressed = false);
  }

  clearPresses() {
    this.keyPresses = {};
    this.touchSwitchPressed = false;
  }
}
window.InputHandler = InputHandler;
