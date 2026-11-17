import Human from "./human.js";
import Logger from "./logger.js";
import Sprite from "./sprite.js";
import Animal from "./animal.js";

export class Game {
	static CLASES = { Animal, Human };
	static ADJACENTS_POSITIONS = {
		0: "top",
		1: "topRight",
		2: "right",
		3: "bottomRight",
		4: "bottom",
		5: "bottomLeft",
		6: "left",
		7: "topLeft",
	};

	constructor(engine) {
		this.engine = engine;

		this.turn = 0;
		this.gameOver = false;

		this.items = [];
		this.state = {
			population: 0,
		};

		// create empty grid
		const cells = this.engine.getParam("boardCasquets");
		this.cells = Array.from({ length: cells }, () =>
			Array.from({ length: cells }, () => null),
		);
	}

	getCellItem(row, col) {
		return this.cells[row]?.[col] ?? null;
	}

	async setCellItem(row, col, item) {
		this.cells[row][col] = item;
	}

	async removeCellItem(row, col) {
		this.cells[row][col] = null;
	}

	getAvailableAdjacentCells(row, col) {
		return Object.values(Game.ADJACENTS_POSITIONS)
			.map((position) => this.getAdjacentCell(row, col, position))
			.filter(
				(cell) =>
					cell !== null &&
					this.getCellItem(cell.row, cell.col) === null,
			);
	}

	/**
	 * Finds a random empty cell.
	 *
	 * @returns
	 */
	getRandomEmptyCell() {
		const cells = this.engine.getParam("boardCasquets");
		let row = null;
		let col = null;
		do {
			row = this.engine.randomInt(0, cells - 1);
			col = this.engine.randomInt(0, cells - 1);
		} while (this.getCellItem(row, col) !== null);

		return { row: row, col: col };
	}

	getCellCenter(col, row) {
		const dimension = this.engine.getParam("boardDimension");
		const cells = this.engine.getParam("boardCasquets");
		const cellSize = dimension / cells;
		const centerX = col * cellSize + cellSize / 2;
		const centerY = row * cellSize + cellSize / 2;

		return { x: centerX, y: centerY };
	}

	getCellPosition(col, row, spriteWidth, spriteHeight) {
		const center = this.getCellCenter(col, row);

		return {
			x: center.x - spriteWidth / 2,
			y: center.y - spriteHeight / 2,
		};
	}

	/**
	 * Calculates the adjacent cell according to a relative position string.
	 *
	 * @param {Casquet} casquet
	 * @param {String} position
	 * @returns ?
	 */
	getAdjacentCell(row, col, position) {
		const casquets = this.engine.getParam("boardCasquets");

		// relative positions
		let topRow = row >= 1 ? row - 1 : null;
		let bottomRow = row < casquets - 1 ? row + 1 : null;
		let leftCol = col >= 1 ? col - 1 : null;
		let rightCol = col < casquets - 1 ? col + 1 : null;

		const adjacents = {
			top: { row: topRow, col: col },
			topRight: { row: topRow, col: rightCol },
			right: { row: row, col: rightCol },
			bottomRight: { row: bottomRow, col: rightCol },
			bottom: { row: bottomRow, col: col },
			bottomLeft: { row: bottomRow, col: leftCol },
			left: { row: row, col: leftCol },
			topLeft: { row: topRow, col: leftCol },
		};

		let adjacentRow = adjacents[position]["row"];
		let adjacentCol = adjacents[position]["col"];

		return adjacentRow !== null && adjacentCol !== null
			? { row: adjacentRow, col: adjacentCol }
			: null;
	}

	async start() {
		// load data
		await this.loadData();

		// new game message
		Logger.subtitle("Nuevo juego");

		// welcome
		Logger.author(this.data.messages.welcome);

		// load items
		Logger.engine("cargando datos...");
		await this.loadItems();

		// ready
		Logger.engine("juego listo!");

		// story
		Logger.narrator(this.data.messages.newGame);

		// show items
		this.showItems();
	}

	async loadData() {
		const response = await fetch("data/data.json");
		this.data = await response.json();
	}

	/**
	 * Factory
	 */
	async loadItems() {
		// iterate items types
		this.data.items.forEach((item) => {
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
				const population = this.engine.randomInt(
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
						const maleProb = this.engine.randomInt(1, 100);
						isMale =
							maleProb <= variant.gender.maleProportions
								? true
								: false;

						// get according sprite
						const sprites = variant.gender.sprites;
						const assetName = isMale
							? sprites.maleSprite
							: sprites.femaleSprite;
						const asset = this.engine.assets[assetName];
						sprite = new Sprite(asset);
					}

					// define item position
					const emptyCell = this.getRandomEmptyCell();

					// create specie instance
					const specie = new classType(
						vulgar,
						emptyCell.row,
						emptyCell.col,
						sprite,
						movingProb,
					);
					specie.sprite = sprite;

					// has gender?
					if (variant.gender !== null) {
						specie.isMale = isMale;
					}

					// has name?
					if (variant.hasName) {
						const name = this.engine.generateFantasyName(isMale);
						specie.name = name;
					}

					// push item to grid
					this.addItem(specie);

					// on create
					specie.onCreate();

					// update stats
					const specieType = variant.camelName;
					const gender = isMale ? "male" : "female";
					this.state.population++;
				}
			});
		});
	}

	showItems() {
		for (const item of [...this.items]) {
			this.showItem(item);
		}
	}

	showItem(item) {
		// calculate item position in grid
		const position = this.getCellPosition(
			item.col,
			item.row,
			item.sprite.width,
			item.sprite.height,
		);

		// random x axis facing
		const flipX = this.engine.randomInt(0, 1) > 0 ? true : false;

		// draw the sprite
		this.engine.drawImage(
			item.sprite.image,
			position.x,
			position.y,
			item.sprite.width,
			item.sprite.height,
			flipX,
		);
	}

	/**
	 * Runs turn mechanics.
	 *
	 * @returns
	 */
	async nextTurn() {
		// increase turn
		this.turn++;
		Logger.subtitle(`Turno ${this.turn}`);

		// A) move all movable items
		for (const item of [...this.items]) {
			// 1. check moving probabilities
			const willMove =
				this.engine.randomInt(1, 100) < item.movingProb ? true : false;
			if (willMove) {
				// 1. determine adjacent cell to move to
				const available = this.getAvailableAdjacentCells(
					item.row,
					item.col,
				);
				if (available.length > 0) {
					const index = this.engine.randomInt(
						0,
						available.length - 1,
					);

					const adjacent = available[index];

					// 2. free source item position
					await this.removeCellItem(item.row, item.col);

					// 3. update item position
					item.row = await adjacent.row;
					item.col = await adjacent.col;

					// 4. update the grid
					await this.setCellItem(adjacent.row, adjacent.col, item);

					// 5. event
					item.onMove();
				} else {
					// item is surrounded, new mechanics
				}
			} else {
				// 1. event
				item.onStay();
			}
		}

		this.engine.renderGrid();
		this.showItems();

		// shuffle items
		this.items = this.engine.shuffle(this.items);
	}

	/**
	 * Add the item to items collection and set it in the grid.
	 *
	 * @param {Item} item
	 */
	addItem(item) {
		this.items.push(item);
		this.setCellItem(item.row, item.col, item);
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
}

export default Game;
