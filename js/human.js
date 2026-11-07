import { Item } from "./item.js";
import Logger from "./logger.js";

export class Human extends Item {
  constructor(vulgar, row, col, sprite, movingProb) {
    super(vulgar, row, col, sprite, movingProb);

    this.isMale = null;
    this.name = null;
  }

  onCreate() {
    // log
    Logger.info(
      `${this.name} te saluda desde la casilla ${this.row},${this.col}`,
    );
  }
}

export default Human;
