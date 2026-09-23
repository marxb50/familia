class Physics {
  static GRAVITY = 0.55;
  static FRICTION = 0.82;
  static MAX_FALL_SPEED = 14;
  static TILE_SIZE = 40;
  static TILE_IMAGES = {};

  static checkAABB(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  // Resolve platform collision for an entity (player or companion)
  static resolvePlatformCollision(entity, platform) {
    // Check if overlapping
    if (!this.checkAABB(entity, platform)) return false;

    // Previous position estimation
    const prevY = entity.y - entity.vy;
    const prevBottom = prevY + entity.height;

    // Landing on top of platform
    if (prevBottom <= platform.y + 12 && entity.vy >= 0) {
      entity.y = platform.y - entity.height;
      entity.vy = 0;
      entity.isGrounded = true;
      if (platform.isMoving && platform.vx) {
        entity.x += platform.vx;
      }
      return true;
    }

    // Hitting head from below
    const prevTop = prevY;
    if (prevTop >= platform.y + platform.height - 10 && entity.vy < 0) {
      entity.y = platform.y + platform.height;
      entity.vy = 0;
      return true;
    }

    // Side collisions
    const prevX = entity.x - entity.vx;
    if (prevX + entity.width <= platform.x + 8) {
      entity.x = platform.x - entity.width;
      entity.vx = 0;
    } else if (prevX >= platform.x + platform.width - 8) {
      entity.x = platform.x + platform.width;
      entity.vx = 0;
    }

    return true;
  }
}
window.Physics = Physics;
