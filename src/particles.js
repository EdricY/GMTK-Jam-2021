import { TAU } from "./globals";
import { randInt, randNorm, randUniform } from "./math";

class ParticleManager {
  parts = [];
  update() {
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i];
      part.update();
      if (part.r <= 0) {
        this.parts.splice(i--, 1);
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i];
      part.draw(ctx);
    }
  }

  generate(x, y, n = 5, r = 5) {
    for (let i = 0; i < n; i++) {
      const part = new BubbleParticle(x, y, r);
      this.parts.push(part);
    }
  }
}

class BubbleParticle {
  constructor(x, y, r) {
    this.x = x + 10 * randUniform();
    this.y = y;
    this.vy = -0.3 + -0.2 * Math.random();
    this.vx = 0.5 * randNorm();
    this.r = 1 + Math.random() * r;
    this.color = Math.random() < 0.5 ? "white" : "#c1fae7";
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, TAU);
    ctx.fill();
    ctx.closePath();
    this.r -= 0.1;
    this.vx += 0.2 * randUniform();
    this.vy -= Math.random() * 0.1;
  }
}

export const particleManager = new ParticleManager();
