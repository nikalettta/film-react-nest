import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    create: jest.fn(),
  };

  const dto = {
    tickets: [{ film: 'film-1', session: 'session-1', row: 1, seat: 2 }],
  } as unknown as CreateOrderDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: mockOrderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('передаёт dto в сервис и возвращает результат', async () => {
      const result = { total: 1, items: dto.tickets };
      mockOrderService.create.mockResolvedValue(result);

      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(mockOrderService.create).toHaveBeenCalledWith(dto);
    });

    it('пробрасывает ошибку сервиса, если место занято', async () => {
      mockOrderService.create.mockRejectedValue(
        new ConflictException('Место 1:2 уже занято'),
      );

      await expect(controller.create(dto)).rejects.toThrow(ConflictException);
    });
  });
});