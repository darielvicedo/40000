export class Logger {
  static title(message) {
    console.log(`%c${message}`, "font-size: 18px; color: #006ac9;");
  }

  static subtitle(message) {
    console.log(`%c${message}`, "font-size: 14px; color: #006ac9;");
  }

  static engine(message) {
    console.log(`%cMotor: ${message}`, "color: #00b4f8;");
  }

  static info(message) {
    console.log(`%cInfo: ${message}`, "color: #5d666e;");
  }

  static narrator(message) {
    console.log(`%cNarrador: ${message}`, "color: #5d31cb;");
  }

  static author(message) {
    console.log(`%cAutor: ${message}`, "color: goldenrod;");
  }
}

export default Logger;
