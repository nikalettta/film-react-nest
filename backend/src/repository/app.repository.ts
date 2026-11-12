import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmsRepository } from './films.repository';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { toFilmDto, toScheduleDto } from '../films/films.mapper';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class AppRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find();
    return films.map(toFilmDto);
  }

  async findSchedule(id: string): Promise<ScheduleDto[] | null> {
    if (!UUID_RE.test(id)) return null;
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
      order: { schedule: { daytime: 'ASC' } },
    });
    return film ? film.schedule.map(toScheduleDto) : null;
  }

  async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    if (!UUID_RE.test(filmId) || !UUID_RE.test(sessionId)) return null;
    return this.schedules.findOneBy({ id: sessionId, filmId });
  }

  async takeSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean> {
    if (!UUID_RE.test(filmId) || !UUID_RE.test(sessionId)) return false;
    return this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(Schedule, {
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!session || session.taken.includes(key)) return false;
      session.taken = [...session.taken, key];
      await manager.save(session);
      return true;
    });
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<void> {
    if (!UUID_RE.test(filmId) || !UUID_RE.test(sessionId)) return;
    await this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(Schedule, {
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!session) return;
      session.taken = session.taken.filter((k) => k !== key);
      await manager.save(session);
    });
  }
}
