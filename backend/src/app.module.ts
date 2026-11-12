import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { FilmsRepository } from './repository/films.repository';
import { AppRepository } from './repository/app.repository';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.getOrThrow<'postgres'>('DATABASE_DRIVER'),
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: Number(config.getOrThrow<string>('DATABASE_PORT')),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        username: config.getOrThrow<string>('DATABASE_USERNAME'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        entities: [Film, Schedule],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    { provide: FilmsRepository, useClass: AppRepository },
  ],
})
export class AppModule {}
