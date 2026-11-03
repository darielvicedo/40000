export class Sprite {
  constructor(img) {
    this.image = img;
    this.width = img.width;
    this.height = img.height;
  }

  moveTo(fromX, fromY, toX, toY, seconds) {
    this.movement = {
      fromX,
      fromY,
      toX,
      toY,
      duration: seconds * 1000,
      elapsed: 0,
    };
  }

  update(deltaTime) {
    if (!this.movement) return;

    const m = this.movement;

    m.elapsed += deltaTime;

    const t = Math.min(m.elapsed / m.duration, 1);

    // Interpolación suave
    const progress = t * t * (3 - 2 * t);

    this.x = m.fromX + (m.toX - m.fromX) * progress;
    this.y = m.fromY + (m.toY - m.fromY) * progress;

    if (t >= 1) {
      this.x = m.toX;
      this.y = m.toY;
      this.movement = null;
    }
  }

  draw(ctx, x, y) {
    ctx.drawImage(this.image, x, y, this.width, this.height);
  }
}

export default Sprite;
