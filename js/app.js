import Game from "./game.js";
import Render from "./render.js";
import Logger from "./logger.js";

/**
 * Entry Point
 */
document.addEventListener("DOMContentLoaded", async (event) => {
    // title
    Logger.title("Bienvenido a 40,000 ANE");

    // html elements
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");
    const newGameButton = document.getElementById("newGame");
    const stepButton = document.getElementById("nextStep");

    // init empty game
    Logger.engine("iniciando juego...");

    // create a new game
    const game = new Game();
    game.start();

    // render
    const render = new Render(ctx, game);
    render.renderGrid();
    render.renderStats();

    // log
    Logger.engine("tablero cargado...");

    // author welcome
    const text =
      "40,000 ANE es un sencillo y pequeño juego de simulación por turnos inspirado " +
      "en la historia humana de hace más de 40 mil años. Lo he ido desarrollando en mi " +
      "tiempo libre para contar a mi hija pequeña la maravillosa historia de nuestra especie. " +
      "Espero que te guste y que te sea útil y divertido como lo ha sido para nosotros.";
    Logger.author(text);

    // new game event
    newGameButton.addEventListener("click", async (event) => {
        // disable button
        event.target.disabled = true;

        // activate step button
        stepButton.disabled = false;

        // init full game
        await game.newGame();

        // render grid
        render.renderGrid();
        render.renderItems();
        render.renderStats();
        render.renderHtml();

        // log
        Logger.engine("nuevo juego listo!");

        // story
        const text =
          `En un paraje remoto del planeta tierra de hace más de 40 mil años, en una pequeña área ` +
          `de 256 km2, aparecieron ${game.state.getTotalHumans()} criaturas de la especie Homo sapiens. Deberán ` +
          `aprender a conocer y utilizar su entorno para poder sobrevivir hasta nuestros días. En cada turno ` +
          `tomarán decisiones que los ayudarán o los alejarán (algunas veces de forma definitiva ☠️) de lograr ` +
          `su objetivo.`;
        Logger.narrator(text);

        // enable button
        event.target.disabled = false;
    });

    // next step event
    stepButton.addEventListener("click", (event) => {
        // disable button
        event.target.disabled = true;

        // log
        Logger.subtitle(`Resumen del turno ${game.state.turn + 1}`);

        // do the step stuff
        game.nextTurn();

        // render state
        render.renderGrid();
        render.renderItems();
        render.renderStats();
        render.renderHtml();

        // enable button
        event.target.disabled = false;
    });
});

// close alerts
document.addEventListener('click', (event) => {
    const closeButton = event.target.closest('.close-notice');
    if (!closeButton) return;

    const notice = closeButton.closest('.notice');
    if (!notice) return;

    notice.classList.add('fade-out');

    setTimeout(() => {
        notice.remove();
    }, 400);
});
