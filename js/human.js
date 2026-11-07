import { Item } from "./item.js";
import Logger from "./logger.js";

export class Human extends Item {
  static LOW_HUMAN_POPULATION = 10;
  static HIGH_HUMAN_POPULATION = 42;
  static MALE_PROPORTIONS = 29;
  static MOVE_PROB = 70;

  constructor(vulgar, row, col, sprite) {
    super(vulgar, row, col, sprite);

    this.male = true;

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
