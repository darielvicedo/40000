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
      const position = this.game.state.grid.getCellPosition(
        item.col,
        item.row,
        item.sprite.width,
        item.sprite.height,
      );

      this.ctx.drawImage(
        item.sprite.image,
        position.x,
        position.y,
        item.sprite.width,
        item.sprite.height,
      );
    }
  }

  /**
   * Renders statistics.
   */
  renderStats() {
    // update male homo sapiens
    const statMaleHomosapiens = document.getElementById("statMaleHomosapiens");
    statMaleHomosapiens.innerText = this.game.state.maleHomosapiens;

    // update male homo sapiens
    const statFemaleHomosapiens = document.getElementById(
      "statFemaleHomosapiens",
    );
    statFemaleHomosapiens.innerText = this.game.state.femaleHomosapiens;
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
