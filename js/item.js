import Sprite from "./sprite.js";
import Logger from "./logger.js";

export class Item {
  /**
   *
   * @param {Sprite} sprite
   */
  constructor(vulgar, row, col, sprite) {
    this.vulgar = vulgar;
    this.row = row;
    this.col = col;
    this.sprite = sprite;
  }

  onCreate() {
    // log
    Logger.info(
      `Un nuevo ${this.vulgar} ha sido creado en la casilla ${this.row},${this.col}`,
    );
  }
}

export default Item;
