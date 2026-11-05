import { Item } from "./item.js";

export class Human extends Item {
  static LOW_HUMAN_POPULATION = 10;
  static HIGH_HUMAN_POPULATION = 42;
  static MALE_PROPORTIONS = 29;
  static MOVE_PROB = 70;

  constructor(male = true) {
    super();

    this.male = male;
  }
}

export default Human;
