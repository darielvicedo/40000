import Game from "./game.js";

export class Render {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
  }

  /**
   * Renders empty grid.
   */
  renderGrid() {
    // clear canvas
    this.ctx.clearRect(0, 0, Game.CANVAS_DIMENSION, Game.CANVAS_DIMENSION);

    const grid = this.game.state.grid;
    const cellSize = Game.CANVAS_DIMENSION / Game.BOARD_CASQUETS;

    // define stroke color
    this.ctx.strokeStyle = "#dddddd";

    for (let y = 0; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        // render every cell
        const cellX = x * cellSize;
        const cellY = y * cellSize;
        this.ctx.rect(cellX, cellY, cellSize, cellSize);
        this.ctx.stroke();
      }
    }
  }

  /**
   * Renders game items.
   */
  renderItems() {
    const items = this.game.state.items;

    for (const item of items) {
      // calculate sprite position in grid
      const position = this.game.state.grid.getCellPosition(
        item.col,
        item.row,
        item.sprite.width,
        item.sprite.height,
      );

      // flip image x axis
      const flipX = Game.randomInt(0, 1) > 0 ? true : false;

      // draw sprite
      this.drawSprite(
        item.sprite.image,
        position.x,
        position.y,
        item.sprite.width,
        item.sprite.height,
        flipX,
      );
    }
  }

  /**
   * Draw an image.
   * 
   * @param {HTMLImageElement} img 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} w 
   * @param {Number} h 
   * @param {Boolean} flipX 
   * @param {Boolean} flipY 
   */
  drawSprite(img, x, y, w, h, flipX = false, flipY = false) {
    const ctx = this.ctx;

    ctx.save();

    // flip?
    ctx.translate(flipX ? x + w : x, flipY ? y + h : y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    // draw
    ctx.drawImage(img, 0, 0, w, h);

    ctx.restore();
  }

  /**
   * Renders statistics.
   */
  renderStats() {
    for (const specieType in this.game.state.population) {
      for (const gender in this.game.state.population[specieType]) {
        const id = `${specieType}.${gender}`;
        const el = document.getElementById(id);
        el.innerText = this.game.state.population[specieType][gender];
      }
    }
  }

  /**
   * Renders other elements.
   */
  renderHtml() {
    const state = this.game.state;

    // next turn text
    const stepButton = document.getElementById("nextStep");
    stepButton.innerText = `Turno ${state.turn}, Siguiente`;
  }
}

export default Render;
