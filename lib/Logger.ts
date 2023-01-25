import { LogLevels } from './Enums';

/**
 * Metronom's internal logger
 * @internal
 */
class Logger {
  static level: LogLevels | null = null;

  constructor(level?: boolean | LogLevels) {
    if (Logger.level !== null) {
      return; // All models must has same level
    }

    if (typeof level === 'boolean' && level === true) {
      Logger.level = LogLevels.All;
      return;
    }
    if (typeof level === 'number') {
      Logger.level = level;
      return;
    }

    Logger.level = LogLevels.None;
  }

  static #log(message: string) {
    console.log(message);
  }

  static log(message: string) {
    if (!(Logger.level === LogLevels.Information || Logger.level === LogLevels.All)) {
      return;
    }
    this.#log(`[ METRONOM ] / ${new Date().toISOString()}: ${message}`);
  }

  static error(message: string) {
    if (!(Logger.level === LogLevels.Error || Logger.level === LogLevels.All)) {
      return;
    }
    this.#log(`\x1b[31m[ METRONOM ERROR ] / ${new Date().toISOString()}: ${message}\x1b[0m`);
  }
}

export default Logger;
