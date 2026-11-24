import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escape(value: string) {
    return value.replace(/\t/g, '\\t').replace(/\n/g, '\\n');
  }

  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const params = optionalParams.length
      ? this.escape(JSON.stringify(optionalParams))
      : '';
    return `level=${level}\tmessage=${this.escape(String(message))}\toptionalParams=${params}`;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }
  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }
  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }
  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }
  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
