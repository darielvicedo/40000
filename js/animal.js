import { Item } from "./item.js";
import Logger from "./logger.js";

export class Animal extends Item {
  constructor(vulgar, row, col, sprite) {
    super(vulgar, row, col, sprite);

    this.male = true;
  }

  onCreate() {
    // log
    const gender = this.male ? "macho" : "hembra";
    Logger.info(
      `Un nuevo ${this.vulgar} ${gender} ha sido creado en la casilla ${this.row},${this.col}`,
    );
  }
}

export default Animal;
