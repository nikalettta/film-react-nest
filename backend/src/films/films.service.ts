import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ListResponseDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: FilmsRepository) {}

  async findAll(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.repository.findAll();
    return { total: items.length, items };
  }

  async findSchedule(id: string): Promise<ListResponseDto<ScheduleDto>> {
    const items = await this.repository.findSchedule(id);
    if (!items) {
      throw new NotFoundException('Фильм не найден');
    }
    return { total: items.length, items };
  }
}
