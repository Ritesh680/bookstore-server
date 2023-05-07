import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { BooksService } from './books.service';

@ApiBearerAuth()
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Get all books' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get(':id')
  getBookById(@Param('id') id: number) {
    return this.bookService.getBookById(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/books',
        filename(req, file, callback) {
          const savingName = file.originalname.split('.')[0] + Date.now();
          const fileExtension = file.originalname.split('.')[1];
          return callback(null, `${savingName}.${fileExtension}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create new book' })
  @ApiResponse({ status: 200, description: 'Create new book' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'title' },
        author: { type: 'string', example: 'author' },
        price: { type: 'string', example: 'price' },
        description: { type: 'string', example: 'description' },
        genre: { type: 'string', example: 'genre' },
        images: {
          type: 'array',
          items: {
            type: 'file',
            format: 'binary',
          },
          maxItems: 5,
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  createBook(
    @Body() bookDetails: BookInfo,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.bookService.createBook(bookDetails, images);
  }

  @Put(':id')
  editBook(@Param('id') id: number, @Body() bookDetails: BookInfo) {
    return this.bookService.editBook(id, bookDetails);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }
}
