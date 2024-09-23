export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

export type CreateLoggerOptions = {
  logLevel?: LogLevel;
};

export class Logger {

  private readonly logLevel: LogLevel;

  private name: string = "MAIN";

  public static create(option: CreateLoggerOptions): Logger {
    return new Logger(option);
  }

  public constructor(option: CreateLoggerOptions) {
    this.logLevel = option.logLevel ?? LogLevel.INFO;
  }

  public error(...messages: unknown[]): void {
    if (this.logLevel < LogLevel.ERROR) return;
    this.print(LogLevel.ERROR, messages);
  }

  public warn(...messages: unknown[]): void {
    if (this.logLevel < LogLevel.WARN) return;
    this.print(LogLevel.WARN, messages);
  }

  public info(...messages: unknown[]): void {
    if (this.logLevel < LogLevel.INFO) return;
    this.print(LogLevel.INFO, messages);
  }

  public debug(...messages: unknown[]): void {
    if (this.logLevel < LogLevel.DEBUG) return;
    this.print(LogLevel.DEBUG, messages);
  }

  private print(level: LogLevel, messages: unknown[]): void {
    console.log(...Logger.getLevelLabel(level), `[${this.name}]`, ...messages);
  }

  private static getLevelLabel(level: LogLevel): string[] {
    switch (level) {
      case LogLevel.ERROR:
        return ["%c ERROR ", "background: #b91c1c; color: white; border-radius: 4px; padding: 2px 4px;"];
      case LogLevel.WARN:
        return ["%c WARN  ", "background: #b45309; color: white; border-radius: 4px; padding: 2px 4px;"];
      case LogLevel.INFO:
        return ["%c INFO  ", "background: #0369a1; color: white; border-radius: 4px; padding: 2px 4px;"];
      case LogLevel.DEBUG:
        return ["%c DEBUG ", "background: #334155; color: white; border-radius: 4px; padding: 2px 4px;"];
      default:
        return ["%c UNKNOWN", "background: #000000; color: white; border-radius: 4px; padding: 2px 4px;"];
    }
  }
}

const logger = Logger.create({
  logLevel: LogLevel.DEBUG,
});
export default logger;
