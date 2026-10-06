import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from '../films/schemas/film.schema';

import { Film, FilmDocument } from '../films/schemas/film.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { toFilmDto, toScheduleDto } from '../films/films.mapper';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();
    return films.map(toFilmDto);
  }

  async findSchedule(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel.findOne({ id }).lean();
    return film ? film.schedule.map(toScheduleDto) : null;
  }

  async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    const film = await this.filmModel
      .findOne({ id: filmId, 'schedule.id': sessionId }, { 'schedule.$': 1 })
      .lean();
    return film?.schedule?.[0] ?? null;
  }

  async takeSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean> {
    const res = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: { $elemMatch: { id: sessionId, taken: { $ne: key } } },
      },
      { $push: { 'schedule.$.taken': key } },
    );
    return res.modifiedCount > 0;
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $pull: { 'schedule.$.taken': key } },
    );
  }
}
