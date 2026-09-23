class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.target = null;
    this.levelWidth = 3200;
    this.levelHeight = 720;
    this.lerpSpeed = 0.08;
  }

  setTarget(target) {
    this.target = target;
  }

  setLevelBounds(width, height) {
    this.levelWidth = width;
    this.levelHeight = height;
  }

  update() {
    if (!this.target) return;

    // Center on target with slight lead in facing direction
    const lead = this.target.facing === 'right' ? 80 : -80;
    const targetX = this.target.x + this.target.width / 2 - this.viewportWidth / 2 + lead;
    const targetY = this.target.y + this.target.height / 2 - this.viewportHeight / 2 - 40;

    // Smooth lerp
    this.x += (targetX - this.x) * this.lerpSpeed;
    this.y += (targetY - this.y) * this.lerpSpeed;

    // Clamp within level bounds
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.viewportHeight));
  }
}
window.Camera = Camera;
