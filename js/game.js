import State from "./state.js";
import Human from "./human.js";
import Logger from "./logger.js";
import Sprite from "./sprite.js";

export class Game {
  static CANVAS_DIMENSION = 800;
  static BOARD_CASQUETS = 16;

  constructor() {
    this.state = null;
  }

  /**
   * Starts engine.
   */
  start() {
    // create state
    this.state = new State();
  }

  /**
   * Creates a new game.
   */
  async newGame() {
    // 1. reset game
    this.start();

    // 2. load assets
    try {
      await Promise.all([
        this.loadAsset(
          "male-homosapiens-paleo",
          "./sprites/homosapiens-male-paleo-48.png",
        ),
        this.loadAsset(
          "female-homosapiens-paleo",
          "./sprites/homosapiens-female-paleo-48.png",
        ),
      ]);
    } catch (err) {
      console.error("Error loading game:", err);
    }
    Logger.engine("recursos cargados...");

    // 3. create humans
    this.createHumans();
  }

  /**
   * Creates the humans and adds them to the game.
   */
  createHumans() {
    // determine human population
    const population = Game.randomInt(
      Human.LOW_HUMAN_POPULATION,
      Human.HIGH_HUMAN_POPULATION,
    );

    for (let i = 0; i < population; i++) {
      // create a new human
      const human = this.newHuman();

      // update items in grid
      this.addItem(human);

      // update stats
      if (human.male) {
        this.state.maleHomosapiens++;
      } else {
        this.state.femaleHomosapiens++;
      }

      // info
      Logger.info(
        `${human.name} te saluda desde la casilla ${human.row},${human.col}.`,
      );
    }
  }

  /**
   * Creates a new human.
   *
   * @returns Human
   */
  newHuman() {
    // define gender
    const maleProb = Game.randomInt(1, 100);
    const male = maleProb <= Human.MALE_PROPORTIONS ? true : false;

    // get according sprite
    const assetName = male
      ? "male-homosapiens-paleo"
      : "female-homosapiens-paleo";
    const asset = this.state.assets[assetName];
    const sprite = new Sprite(asset);

    // generate name
    const name = this.generateFantasyName(male);

    // create human
    const human = new Human(name, male);
    human.sprite = sprite;

    // define item position
    let row = null;
    let col = null;
    do {
      row = Game.randomInt(0, Game.BOARD_CASQUETS - 1);
      col = Game.randomInt(0, Game.BOARD_CASQUETS - 1);
      human.row = row;
      human.col = col;
    } while (this.state.grid.get(row, col) !== null);

    return human;
  }

  /**
   * Runs the next turn.
   *
   * @returns
   */
  nextTurn() {
    if (!this.state) return;

    this.state.nextTurn();
  }

  /**
   * Add the item to items collection and set it in the grid.
   *
   * @param {Item} item
   */
  addItem(item) {
    this.state.items.push(item);
    this.state.grid.set(item.row, item.col, item);
  }

  /**
   * Loads an asset and adds it to the assets collection.
   *
   * @param {String} name
   * @param {String} src
   * @returns
   */
  loadAsset(name, src) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.state.assets[name] = image;
        resolve(image);
      };

      image.onerror = (err) => {
        reject(err);
      };

      image.src = src;

      this.state.assets[name] = image;
    });
  }

  /**
   * Renders other HTML elements.
   */
  renderHtml() {
    const state = this.get("state");

    // next turn text
    const stepButton = document.getElementById("nextStep");
    stepButton.innerText = `Turno ${state["step"]}, Siguiente`;
  }

  /**
   * Gets a random integer between min and max included.
   *
   * @param {Number} min
   * @param {Number} max
   * @returns Number
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates  a fantasy name --generated with ChatGPT.
   *
   * @param {Boolean} male
   * @param {Boolean} lastName
   * @returns
   */
  generateFantasyName(male = true, lastName = true) {
    const consonants = [
      "b",
      "br",
      "c",
      "ch",
      "d",
      "dr",
      "f",
      "fl",
      "g",
      "gr",
      "h",
      "j",
      "k",
      "kr",
      "l",
      "m",
      "n",
      "p",
      "pr",
      "r",
      "s",
      "sh",
      "st",
      "t",
      "th",
      "tr",
      "v",
      "w",
      "y",
      "z",
    ];

    const vowels = [
      "a",
      "e",
      "i",
      "o",
      "u",
      "ae",
      "ai",
      "ea",
      "ee",
      "ia",
      "ie",
      "oa",
      "oo",
      "ou",
      "ui",
    ];

    const maleEndings = [
      "an",
      "ar",
      "en",
      "er",
      "ian",
      "iel",
      "in",
      "on",
      "or",
      "yn",
      "is",
      "eth",
      "as",
      "us",
      "ael",
      "ion",
    ];

    const femaleEndings = [
      "a",
      "ia",
      "ina",
      "elle",
      "ara",
      "ana",
      "iel",
      "ine",
      "ora",
      "wen",
      "eth",
      "issa",
      "aya",
      "eia",
      "lyn",
      "ith",
    ];

    const surnameEndings = [
      "ford",
      "wood",
      "stone",
      "well",
      "brook",
      "field",
      "mere",
      "dale",
      "thorn",
      "wick",
      "more",
      "borne",
      "crest",
      "vale",
      "hart",
    ];

    const random = (array) => array[Math.floor(Math.random() * array.length)];

    function generateRoot(min = 2, max = 3) {
      const syllables = min + Math.floor(Math.random() * (max - min + 1));

      let name = "";

      for (let i = 0; i < syllables; i++) {
        name += random(consonants);
        name += random(vowels);
      }

      return name;
    }

    // Nombre propio según género
    const endings = male ? maleEndings : femaleEndings;

    let firstName = generateRoot(1, 2) + random(endings);

    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    if (!lastName) return firstName;

    // Apellido independiente del género
    let surname = generateRoot(1, 1) + random(surnameEndings);

    surname = surname.charAt(0).toUpperCase() + surname.slice(1);

    return `${firstName} ${surname}`;
  }
}

export default Game;
