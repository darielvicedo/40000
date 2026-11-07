import Game from "./game.js";
import Grid from "./grid.js";
import Human from "./human.js";
import Logger from "./logger.js";

export class State {
  static ADJACENTS_POSITIONS = {
    0: "top",
    1: "top-right",
    2: "right",
    3: "bottom-right",
    4: "bottom",
    5: "bottom-left",
    6: "left",
    7: "top-left",
  };

  constructor() {
    this.grid = new Grid(Game.BOARD_CASQUETS, Game.BOARD_CASQUETS);

    this.items = [];
    this.assets = [];
    this.population = {
      homoSapiens: { male: 0, female: 0 },
      pantheraSpelaea: { male: 0, female: 0 },
    };

    this.turn = 0;

    this.gameOver = false;
  }

  getSpeciePopulation(specieName) {
    return (
      this.population[specieName]["male"] +
      this.population[specieName]["female"]
    );
  }

  /**
   * Calculates the adjacent cell according to a relative position string.
   *
   * @param {Casquet} casquet
   * @param {String} position
   * @returns ?
   */
  getAdjacentCell(row, col, position) {
    // relative positions
    let topRow = row >= 1 ? row - 1 : null;
    let bottomRow = row < Game.BOARD_CASQUETS - 1 ? row + 1 : null;
    let leftCol = col >= 1 ? col - 1 : null;
    let rightCol = col < Game.BOARD_CASQUETS - 1 ? col + 1 : null;

    const adjacents = {
      top: { row: topRow, col: col },
      "top-right": { row: topRow, col: rightCol },
      right: { row: row, col: rightCol },
      "bottom-right": { row: bottomRow, col: rightCol },
      bottom: { row: bottomRow, col: col },
      "bottom-left": { row: bottomRow, col: leftCol },
      left: { row: row, col: leftCol },
      "top-left": { row: topRow, col: leftCol },
    };

    let adjacentRow = adjacents[position]["row"];
    let adjacentCol = adjacents[position]["col"];

    return adjacentRow !== null && adjacentCol !== null
      ? { row: adjacentRow, col: adjacentCol }
      : null;
  }

  nextTurn() {
    // A) move all movable items
    for (const item of [...this.items]) {
      // 1. check moving probabilities
      const willMove = Game.randomInt(1, 100) < item.movingProb ? true : false;
      if (willMove) {
        // 1. determine adjacent cell to move to
        let adjacent = null;
        do {
          const position = State.ADJACENTS_POSITIONS[Game.randomInt(0, 7)];
          adjacent = this.getAdjacentCell(item.row, item.col, position);
        } while (
          adjacent === null ||
          this.grid.get(adjacent.row, adjacent.col) !== null
        );

        // 2. free source item position
        this.grid.remove(item.row, item.col);

        // 3. update item position
        item.row = adjacent.row;
        item.col = adjacent.col;

        // 4. update the grid
        this.grid.set(adjacent.row, adjacent.col, item);

        // 5. event
        item.onMove();
      } else {
        // 1. event
        item.onStay();
        continue;
      }
    }

    this.turn++;
  }
}

export default State;
