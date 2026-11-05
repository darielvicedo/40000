import Game from "./game.js";

export class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.cells = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    );
  }

  get(row, col) {
    return this.cells[row]?.[col] ?? null;
  }

  set(row, col, item) {
    this.cells[row][col] = item;
  }

  remove(row, col) {
    this.cells[row][col] = null;
  }

  /**
   * Finds a random empty cell.
   * 
   * @returns 
   */
  getRandomEmptyCell() {
    let row = null;
    let col = null;
    do {
      row = Game.randomInt(0, Game.BOARD_CASQUETS - 1);
      col = Game.randomInt(0, Game.BOARD_CASQUETS - 1);
    } while (this.get(row, col) !== null);

    return { row: row, col: col };
  }

  getCellCenter(col, row) {
    const cellSize = Game.CANVAS_DIMENSION / Game.BOARD_CASQUETS;
    const centerX = col * cellSize + cellSize / 2;
    const centerY = row * cellSize + cellSize / 2;

    return { x: centerX, y: centerY };
  }

  getCellPosition(col, row, spriteWidth, spriteHeight) {
    const center = this.getCellCenter(col, row);

    return {
      x: center.x - spriteWidth / 2,
      y: center.y - spriteHeight / 2,
    };
  }
}

export default Grid;
