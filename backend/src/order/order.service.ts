import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, TicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto) {
    if (!dto.tickets?.length) {
      throw new BadRequestException('Заказ не содержит билетов');
    }

    const seen = new Set<string>();
    for (const t of dto.tickets) {
      const key = `${t.row}:${t.seat}`;
      const unique = `${t.film}|${t.session}|${key}`;

      if (seen.has(unique)) {
        throw new BadRequestException(`Место ${key} указано в заказе дважды`);
      }
      seen.add(unique);

      const session = await this.filmsRepository.findSession(t.film, t.session);
      if (!session) {
        throw new NotFoundException('Фильм или сеанс не найден');
      }
      if (
        !Number.isInteger(t.row) ||
        !Number.isInteger(t.seat) ||
        t.row < 1 ||
        t.row > session.rows ||
        t.seat < 1 ||
        t.seat > session.seats
      ) {
        throw new BadRequestException(`Места ${key} не существует в зале`);
      }
      if (session.taken.includes(key)) {
        throw new ConflictException(`Место ${key} уже занято`);
      }
    }

    const reserved: TicketDto[] = [];
    for (const t of dto.tickets) {
      const key = `${t.row}:${t.seat}`;
      const ok = await this.filmsRepository.takeSeat(t.film, t.session, key);
      if (!ok) {
        for (const r of reserved) {
          await this.filmsRepository.releaseSeat(
            r.film,
            r.session,
            `${r.row}:${r.seat}`,
          );
        }
        throw new ConflictException(`Место ${key} уже занято`);
      }
      reserved.push(t);
    }

    return { total: reserved.length, items: reserved };
  }
}
