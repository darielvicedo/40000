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
      this.population[specieName]["male"] + this.population[specieName]["female"]
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
    this.turn++;

    // iterate items
    for (const item of [...this.items]) {
      // actions if item is human
      if (item instanceof Human) {
        // 1. determine if the human will move
        const willMove =
          Game.randomInt(1, 100) < Human.MOVE_PROB ? true : false;

        // 1.1 do nothing if human stay
        if (!willMove) {
          Logger.info(`${item.name} ha decidido mantenerse en el lugar.`);
          continue;
        }

        // 2. determine adjacent cell to move to
        let adjacent = null;
        do {
          const position = State.ADJACENTS_POSITIONS[Game.randomInt(0, 7)];
          adjacent = this.getAdjacentCell(item.row, item.col, position);
        } while (
          adjacent === null ||
          this.grid.get(adjacent.row, adjacent.col) !== null
        );

        // log
        Logger.info(
          `${item.name} se ha movido desde ${item.row},${item.col} hasta ${adjacent.row},${adjacent.col}`,
        );

        // 3. free item position
        this.grid.remove(item.row, item.col);

        // 4. update item position
        item.row = adjacent.row;
        item.col = adjacent.col;

        // 5. update the grid
        this.grid.set(adjacent.row, adjacent.col, item);
      }
    }
  }
}

export default State;
