import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('возвращает корректный JSON с level, message и optionalParams', () => {
      const result = logger.formatMessage('log', 'hello', 'a', 1);
      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'hello',
        optionalParams: ['a', 1],
      });
    });

    it('возвращает пустой массив optionalParams, если параметров нет', () => {
      const result = logger.formatMessage('log', 'hello');
      expect(JSON.parse(result).optionalParams).toEqual([]);
    });
  });

  it('log пишет в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('hello', 'ctx');
    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('log', 'hello', 'ctx'),
    );
  });

  it('error пишет в console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('boom');
    expect(spy).toHaveBeenCalledWith(logger.formatMessage('error', 'boom'));
  });

  it('warn пишет в console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('careful');
    expect(spy).toHaveBeenCalledWith(logger.formatMessage('warn', 'careful'));
  });

  it('debug пишет в console.debug', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    logger.debug('dbg');
    expect(spy).toHaveBeenCalledWith(logger.formatMessage('debug', 'dbg'));
  });

  it('verbose пишет в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.verbose('verb');
    expect(spy).toHaveBeenCalledWith(logger.formatMessage('verbose', 'verb'));
  });
});
