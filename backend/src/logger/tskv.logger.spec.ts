import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('формирует строку ключ=значение через табуляцию', () => {
      const result = logger.formatMessage('log', 'hello');
      expect(result).toBe('level=log\tmessage=hello\toptionalParams=');
    });

    it('сериализует optionalParams', () => {
      const result = logger.formatMessage('log', 'hello', 'a', 1);
      expect(result).toBe('level=log\tmessage=hello\toptionalParams=["a",1]');
    });

    it('экранирует табуляцию и перенос строки в сообщении', () => {
      const result = logger.formatMessage('log', 'a\tb\nc');
      expect(result).toBe('level=log\tmessage=a\\tb\\nc\toptionalParams=');
    });

    it('содержит ровно 3 поля, разделённых табуляцией', () => {
      const result = logger.formatMessage('log', 'a\tb');
      expect(result.split('\t')).toHaveLength(3);
    });
  });

  it('log пишет в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('hello');
    expect(spy).toHaveBeenCalledWith(logger.formatMessage('log', 'hello'));
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
