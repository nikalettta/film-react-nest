import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: mockFilmsService }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('возвращает список фильмов из сервиса', async () => {
      const result = { total: 1, items: [{ id: '1', title: 'Фильм' }] };
      mockFilmsService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(mockFilmsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findSchedule', () => {
    it('передаёт id в сервис и возвращает расписание', async () => {
      const result = { total: 1, items: [{ id: 's1', daytime: '10:00' }] };
      mockFilmsService.findSchedule.mockResolvedValue(result);

      await expect(controller.findSchedule('film-1')).resolves.toEqual(result);
      expect(mockFilmsService.findSchedule).toHaveBeenCalledWith('film-1');
    });

    it('пробрасывает NotFoundException, если фильм не найден', async () => {
      mockFilmsService.findSchedule.mockRejectedValue(
        new NotFoundException('Фильм не найден'),
      );

      await expect(controller.findSchedule('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
