import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Books';
import { auth } from 'src/middleware/auth.middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    NestjsFormDataModule,
    MulterModule.register(),
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(auth)
      .forRoutes({ path: '/books', method: RequestMethod.ALL });
  }
}
