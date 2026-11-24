import { ConsoleLogger } from '@nestjs/common';
import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  it('наследуется от ConsoleLogger', () => {
    expect(new DevLogger()).toBeInstanceOf(ConsoleLogger);
  });

  it('метод log не падает и выводит сообщение', () => {
    const logger = new DevLogger();
    const spy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    logger.log('hello');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
