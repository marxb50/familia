class Collectible {
  constructor(type, x, y, colorName = 'green') {
    this.type = type; // 'heart' or 'star'
    this.x = x;
    this.y = y;
    // 25% larger size for mobile visibility
    this.width = 46;
    this.height = 46;
    this.colorName = colorName;
    this.collected = false;
    this.animTime = Math.random() * Math.PI * 2;
    this.sprite = new Image();
    this.loadSprite();
  }

  loadSprite() {
    if (this.type === 'heart') {
      this.sprite.src = `assets/images/ui/heart_${this.colorName}.png`;
    } else if (this.type === 'brush') {
      this.sprite.src = `assets/images/ui/item_brush_blue.png`;
      this.width = 54;
      this.height = 54;
    } else if (this.type === 'banner') {
      this.sprite.src = `assets/images/ui/item_banner_courage.png`;
      this.width = 54;
      this.height = 54;
    } else if (this.type === 'music') {
      this.sprite.src = `assets/images/ui/item_music_rose.png`;
      this.width = 54;
      this.height = 54;
    } else {
      this.sprite.src = `assets/images/ui/star_gold.png`;
    }
  }

  update() {
    this.animTime += 0.06;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.save();
    const bobY = Math.sin(this.animTime) * 7;
    const drawX = Math.round(this.x);
    const drawY = Math.round(this.y + bobY);

    const glowColors = {
      'green': 'rgba(76, 175, 80, 0.45)',
      'yellow': 'rgba(255, 235, 59, 0.5)',
      'blue': 'rgba(33, 150, 243, 0.55)',
      'red': 'rgba(244, 67, 54, 0.55)',
      'pink': 'rgba(233, 30, 99, 0.55)',
      'rainbow': 'rgba(255, 192, 203, 0.7)',
      'brush': 'rgba(33, 150, 243, 0.65)',
      'banner': 'rgba(244, 67, 54, 0.65)',
      'music': 'rgba(233, 30, 99, 0.65)'
    };
    const halo = glowColors[this.type] || glowColors[this.colorName] || 'rgba(255, 215, 0, 0.5)';

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(drawX + this.width / 2, drawY + this.height / 2, this.width * 0.8, 0, Math.PI * 2);
    ctx.fill();

    if (this.sprite && this.sprite.complete && this.sprite.naturalWidth > 0) {
      ctx.drawImage(this.sprite, drawX, drawY, this.width, this.height);
    } else {
      ctx.fillStyle = '#e91e63';
      ctx.beginPath();
      ctx.arc(drawX + this.width / 2, drawY + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnHeartSparkle(x, y, color) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 7 + 4,
        color: color || '#ff4081',
        isStar: Math.random() < 0.4
      });
    }
  }

  spawnConfetti(width, height) {
    const colors = ['#4caf50', '#ffeb3b', '#2196f3', '#f44336', '#e91e63', '#9c27b0'];
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2.5,
        life: 1.0,
        decay: Math.random() * 0.008 + 0.004,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        isConfetti: true,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= p.decay;
      if (p.isConfetti) {
        p.angle += p.spin;
      }
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      if (p.isConfetti) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else if (p.isStar) {
        ctx.font = `${Math.round(p.size * 2)}px sans-serif`;
        ctx.fillText('✨', p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

window.Collectible = Collectible;
window.ParticleSystem = ParticleSystem;
