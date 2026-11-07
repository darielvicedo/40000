import Sprite from "./sprite.js";
import Logger from "./logger.js";

export class Item {
  /**
   *
   * @param {Sprite} sprite
   */
  constructor(vulgar, row, col, sprite, movingProb) {
    this.vulgar = vulgar;
    this.row = row;
    this.col = col;
    this.sprite = sprite;
    this.movingProb = movingProb;
  }

  onCreate() {
    // log
    Logger.info(
      `Un nuevo ${this.vulgar} ha sido creado en la casilla ${this.row},${this.col}`,
    );
  }

  onStay() {
    if (this.name !== undefined && this.name !== null) {
      Logger.info(
        `${this.name} ha decidido mantenerse en su casilla ${this.row},${this.col}.`,
      );
    } else {
      Logger.info(
        `Un ${this.vulgar} ha decidido mantenerse en su casilla ${this.row},${this.col}.`,
      );
    }
  }

  onMove() {
    if (this.name !== undefined && this.name !== null) {
      Logger.info(`${this.name} se ha movido hacia ${this.row},${this.col}`);
    } else {
      Logger.info(
        `Un ${this.vulgar} se ha movido hacia ${this.row},${this.col}.`,
      );
    }
  }
}

export default Item;
