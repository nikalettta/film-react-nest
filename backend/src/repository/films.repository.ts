import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { Schedule } from '../films/entities/schedule.entity';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(id: string): Promise<ScheduleDto[] | null>;
  abstract findSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null>;
  abstract takeSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean>;
  abstract releaseSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<void>;
}
