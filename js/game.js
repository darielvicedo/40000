import State from "./state.js";
import Human from "./human.js";
import Logger from "./logger.js";
import Sprite from "./sprite.js";
import Animal from "./animal.js";

export class Game {
  static CANVAS_DIMENSION = 800;
  static BOARD_CASQUETS = 16;
  static CLASES = { Animal, Human };

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
        this.loadAsset(
          "male-pantheraspelaea",
          "./sprites/pantheraspelaea-male-48.png",
        ),
        this.loadAsset(
          "female-pantheraspelaea",
          "./sprites/pantheraspelaea-female-48.png",
        ),
      ]);
    } catch (err) {
      console.error("Error loading game:", err);
    }
    Logger.engine("recursos cargados.");

    // 3. load items
    await this.loadItems();
  }

  /**
   * Factory
   */
  async loadItems() {
    // load data file
    const response = await fetch("../data/data.json");
    const itemsData = await response.json();

    // iterate items types
    itemsData.forEach((item) => {
      // get class type
      const classType = Game.CLASES[item.classType];
      if (!classType) return;

      // iterate variants
      const variants = item.variants.forEach((variant) => {
        // vulgar name
        const vulgar = variant.vulgar;

        // moving probability
        const movingProb = variant.movingProb;

        // determine population
        const population = Game.randomInt(
          variant.lowPopulation,
          variant.highPopulation,
        );

        // iterate population
        for (let i = 0; i < population; i++) {
          // define  sprite
          let sprite = variant.sprite;

          // define gender
          let isMale = null;
          if (variant.gender !== null) {
            const maleProb = Game.randomInt(1, 100);
            isMale = maleProb <= variant.gender.maleProportions ? true : false;

            // get according sprite
            const sprites = variant.gender.sprites;
            const assetName = isMale
              ? sprites.maleSprite
              : sprites.femaleSprite;
            const asset = this.state.assets[assetName];
            sprite = new Sprite(asset);
          }

          // define item position
          const emptyCell = this.state.grid.getRandomEmptyCell();

          // create specie instance
          const specie = new classType(
            vulgar,
            emptyCell.row,
            emptyCell.col,
            sprite,
            movingProb
          );
          specie.sprite = sprite;

          // has gender?
          if (variant.gender !== null) {
            specie.isMale = isMale;
          }

          // has name?
          if (variant.hasName) {
            const name = this.generateFantasyName(isMale);
            specie.name = name;
          }

          // push item to grid
          this.addItem(specie);

          // on create
          specie.onCreate();

          // update stats
          const specieType = variant.camelName;
          const gender = isMale ? "male" : "female";
          this.state.population[specieType][gender]++;
        }
      });
    });
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
