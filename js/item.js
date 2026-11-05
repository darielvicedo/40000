import Sprite from "./sprite.js";
import Logger from "./logger.js";

export class Item {
  /**
   *
   * @param {Sprite} sprite
   */
  constructor() {
    this.row = null;
    this.col = null;
    this.sprite = null;
    this.vulgar = null;
  }

  onCreate() {
    // log
    Logger.info(
      `Un nuevo ${this.vulgar} ha sido creado en la casilla ${this.row},${this.col}`,
    );
  }
}

export default Item;
