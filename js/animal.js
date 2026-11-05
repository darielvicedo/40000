import { Item } from "./item.js";

export class Animal extends Item {
  constructor(male = true) {
    super();

    this.male = male;
  }
}

export default Animal;
