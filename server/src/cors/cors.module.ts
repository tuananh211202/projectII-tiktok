import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as cors from 'cors';

@Module({})
export class CorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors())
      .forRoutes('*');
  }
}