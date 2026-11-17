import Logger from "./logger.js";
import Game from "./game.js";

export class Engine {
	constructor(ctx) {
		this.ctx = ctx;

		this.config = {};
		this.assets = Object.create(null);
	}

	/**
	 * Gets a configuration value.
	 *
	 * @param {String} key
	 * @returns *
	 */
	getParam(key) {
		const value = this.config[key];
		if (value === undefined)
			throw new Error("El parámetro solicitado no existe.");

		return value;
	}

	/**
	 * Starts the engine.
	 */
	async ignite() {
		await this.loadConfig();

		Logger.title(`Bienvenido a ${this.getParam("title")}`);

		await this.loadAssets();

		Logger.engine("Archivos cargados.");

		this.renderGrid();

		Logger.engine("Tablero cargado.");
	}

	async newGame() {
		// refresh grid
		this.renderGrid();

		// new game
		this.game = new Game(this);
		await this.game.start();
	}

	async advance() {
		await this.game.nextTurn();
	}

	/**
	 * Loads  configuration file.
	 */
	async loadConfig() {
		try {
			const response = await fetch("data/config.json");
			this.config = await response.json();
		} catch (e) {
			throw new Error(
				"No se ha podido cargar el archivo de configuración.",
			);
		}
	}

	/**
	 * Loads game assets.
	 */
	async loadAssets() {
		const assets = this.getParam("assets");

		await Promise.all(
			assets.map((asset) =>
				this.loadAsset(asset.name, `assets/${asset.src}`),
			),
		);
	}

	/**
	 * Loads an asset file.
	 *
	 * @param {String} name
	 * @param {String} src
	 * @returns Promise
	 */
	loadAsset(name, src) {
		return new Promise((resolve, reject) => {
			const image = new Image();

			image.onload = () => {
				this.assets[name] = image;
				resolve(image);
			};

			image.onerror = () => {
				reject(new Error(`No se pudo cargar: ${src}`));
			};

			image.src = src;
		});
	}

	/**
	 * Renders empty grid.
	 */
	renderGrid() {
		const dimension = this.getParam("boardDimension");
		const cells = this.getParam("boardCasquets");

		const cellSize = dimension / cells;
		const ctx = this.ctx;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		ctx.strokeStyle = "#dddddd";
		ctx.beginPath();

		for (let row = 0; row < cells; row++) {
			for (let col = 0; col < cells; col++) {
				ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
			}
		}

		ctx.stroke();
	}

	/**
	 * Draws an image.
	 *
	 * @param {HTMLImageElement} img
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Boolean} flipX
	 * @param {Boolean} flipY
	 */
	drawImage(img, x, y, w, h, flipX = false, flipY = false) {
		const ctx = this.ctx;

		ctx.save();

		// flip?
		ctx.translate(flipX ? x + w : x, flipY ? y + h : y);
		ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

		// draw
		ctx.drawImage(img, 0, 0, w, h);

		ctx.restore();
	}

	/**
	 * Gets a random integer between min and max included.
	 *
	 * @param {Number} min
	 * @param {Number} max
	 * @returns Number
	 */
	randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Shuffles items array.
	 *
	 * Shuffles items array in order to randomize
	 * the priority order (Fisher-Yates Algorithm).
	 */
	shuffle(items) {
		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));

			[items[i], items[j]] = [items[j], items[i]];
		}

		return items;
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

		const random = (array) =>
			array[Math.floor(Math.random() * array.length)];

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

export default Engine;
