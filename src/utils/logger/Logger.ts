import {DateUtil} from "@/utils/DateUtil.ts";

export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

export type CreateLoggerOptions = {
  logLevel?: LogLevel;
  logLabel?: string;
  showTime?: boolean;
  showLabel?: boolean;
};

export class Logger {

  private readonly logLevel: LogLevel;

  private readonly logLabel: string = "MAIN";

  private readonly showTime: boolean = true;

  private readonly showLabel: boolean = true;

  public static create(option: CreateLoggerOptions): Logger {
    return new Logger(option);
  }

  public constructor(option: CreateLoggerOptions) {
    this.logLevel = option.logLevel ?? LogLevel.INFO;
    this.logLabel = option.logLabel ?? "MAIN";
    this.showTime = option.showTime ?? true;
    this.showLabel = option.showLabel ?? true;
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
    const params = this.getPrintParams(level, messages);
    switch (level) {
      case LogLevel.ERROR:
        console.error(...params);
        break;
      case LogLevel.WARN:
        console.warn(...params);
        break;
      case LogLevel.INFO:
        console.info(...params);
        break;
      case LogLevel.DEBUG:
        console.debug(...params);
        break;
      default:
        console.log(...params);
    }
  }

  private getPrintParams(level: LogLevel, messages: unknown[]): unknown[] {
    const params = [];
    params.push(...Logger.getLevelLabel(level));
    if (this.showTime) {
      params.push(`[${DateUtil.getCurrentTime()}]`);
    }
    if (this.showLabel) {
      params.push(`[${this.logLabel}]`);
    }
    params.push(...messages);
    return params;
  }

  private static getLevelLabel(level: LogLevel): string[] {
    switch (level) {
      case LogLevel.ERROR:
        return ["%c ERROR ", "background: #b91c1c; color: white; border-radius: 4px; padding: 2px 4px;"];
      case LogLevel.WARN:
        return ["%c WARN  ", "background: #b45309; color: white; border-radius: 4px; padding: 2px 4px;"];
      case LogLevel.INFO:
        return ["%c INFO  ", "background: #0369a1; color: white; border-radius: 4px; padding: 2px 4px; margin-left: 14px;"];
      case LogLevel.DEBUG:
        return ["%c DEBUG ", "background: #334155; color: white; border-radius: 4px; padding: 2px 4px; margin-left: 14px;"];
      default:
        return ["%c UNKNOWN", "background: #000000; color: white; border-radius: 4px; padding: 2px 4px; margin-left: 14px;"];
    }
  }
}

const logger = Logger.create({
  logLevel: LogLevel.DEBUG,
});
export default logger;
