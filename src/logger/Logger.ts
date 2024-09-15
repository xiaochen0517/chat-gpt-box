export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export type LoggerCreateOptions = {
  logLevel: LogLevel;
  formatOptions: FormatOptions;
};

export type FormatOptions = {
  showTime?: boolean;
  showLogLevel?: boolean;
};

export const DEFAULT_LOGGER_CREATE_OPTIONS: LoggerCreateOptions = {
  logLevel: LogLevel.INFO,
  formatOptions: {
    showTime: true,
    showLogLevel: true,
  },
};


export class Logger {

  private logLevel: LogLevel;

  private formatOptions: FormatOptions = {
    showTime: true,
    showLogLevel: true,
  };

  private LOG_LABEL_STYLES = {
    debug: "background: #7e7e7e; color: #fefefe; padding: 2px 0; border-radius: 5px;",
    info: "background: #007bff; color: #fff; padding: 2px 0px; border-radius: 5px;",
    warn: "background: #ffc107; color: #000; padding: 2px 0; border-radius: 5px;",
    error: "background: #dc3545; color: #fff; padding: 2px 0; border-radius: 5px;",
  };

  constructor(loggerCreateOptions: Partial<LoggerCreateOptions> | undefined) {
    // Merge the default options with the provided options
    const finalLoggerCreateOptions = Object.assign({}, DEFAULT_LOGGER_CREATE_OPTIONS, loggerCreateOptions);
    if (finalLoggerCreateOptions.logLevel < LogLevel.DEBUG || finalLoggerCreateOptions.logLevel > LogLevel.ERROR) {
      throw new Error("Invalid log level");
    }
    this.logLevel = finalLoggerCreateOptions.logLevel;
    this.formatOptions = finalLoggerCreateOptions.formatOptions;
  }

  private printLog(logLevelLabel: string, logLevelStyle: string, messages: unknown[]) {
    const logParams = [];
    if (this.formatOptions.showLogLevel) {
      logParams.push(logLevelLabel, logLevelStyle);
    }
    if (this.formatOptions.showTime) {
      const currentDate = new Date();
      logParams.push(`[${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}]`);
    }
    console.log(...logParams, ...messages);
  }

  public debug(...messages: unknown[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.printLog("%c DEBUG ", this.LOG_LABEL_STYLES.debug, messages);
    }
  }

  public info(...messages: unknown[]) {
    if (this.logLevel <= LogLevel.INFO) {
      this.printLog("%c INFO  ", this.LOG_LABEL_STYLES.info, messages);
    }
  }

  public warn(...messages: unknown[]) {
    if (this.logLevel <= LogLevel.WARN) {
      this.printLog("%c WARN  ", this.LOG_LABEL_STYLES.warn, messages);
    }
  }

  public error(...messages: unknown[]) {
    if (this.logLevel <= LogLevel.ERROR) {
      this.printLog("%c ERROR ", this.LOG_LABEL_STYLES.error, messages);
    }
  }

  public setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  public getLogLevel() {
    return this.logLevel;
  }
}

export const createLogger = (loggerCreateOptions: Partial<LoggerCreateOptions> | undefined) => {
  return new Logger(loggerCreateOptions);
};

export const logger = createLogger({
  logLevel: LogLevel.DEBUG,
});
