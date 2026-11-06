import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escape(value: string) {
    return value.replace(/\t/g, '\\t').replace(/\n/g, '\\n');
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const params = optionalParams.length
      ? this.escape(JSON.stringify(optionalParams))
      : '';
    return `level=${level}\tmessage=${this.escape(String(message))}\toptionalParams=${params}`;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }
  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }
  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
