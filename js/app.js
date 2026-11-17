import Engine from "./engine.js";

/**
 * Entry Point
 */
document.addEventListener("DOMContentLoaded", async (event) => {
  // get context
  const canvas = document.getElementById("grid");
  const ctx = canvas.getContext("2d");

  // create engine
  const engine = new Engine(ctx);
  engine.ignite();

  // html elements
  const newGameButton = document.getElementById("newGame");
  const stepButton = document.getElementById("nextStep");

  // new game event
  newGameButton.addEventListener("click", async (event) => {
    // disable button
    event.target.disabled = true;

    // go
    engine.newGame();

    // enable button
    event.target.disabled = false;
    stepButton.disabled = false;
  });

  // next step event
  stepButton.addEventListener("click", (event) => {
    // disable button
    event.target.disabled = true;

    // do the step stuff
    engine.advance();

    // enable button
    event.target.disabled = false;
  });
});

// close alerts
document.addEventListener("click", (event) => {
  const closeButton = event.target.closest(".close-notice");
  if (!closeButton) return;

  const notice = closeButton.closest(".notice");
  if (!notice) return;

  notice.classList.add("fade-out");

  setTimeout(() => {
    notice.remove();
  }, 400);
});
