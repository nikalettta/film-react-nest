import { Film, Schedule } from './schemas/film.schema';
import { FilmDto, ScheduleDto } from './dto/films.dto';

export const toScheduleDto = (s: Schedule): ScheduleDto => ({
  id: s.id,
  daytime: s.daytime,
  hall: s.hall,
  rows: s.rows,
  seats: s.seats,
  price: s.price,
  taken: s.taken,
});

export const toFilmDto = (f: Film): FilmDto => ({
  id: f.id,
  rating: f.rating,
  director: f.director,
  tags: f.tags,
  image: f.image,
  cover: f.cover,
  title: f.title,
  about: f.about,
  description: f.description,
});
