import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Books';
import { SuccessResponse } from 'src/utils/Responses';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async getAllBooks() {
    const books = await this.bookRepository.find();
    return SuccessResponse('Books fetched successfully', books);
  }

  async getBookById(id: number) {
    const book = await this.findBookById(id);
    return SuccessResponse('Book fetched successfully', book);
  }

  async createBook(bookDetails: BookInfo, images: Express.Multer.File[]) {
    try {
      const imagesPath = images.map((image) => image.path);
      const newBook = this.bookRepository.create({
        ...bookDetails,
        images: [...imagesPath],
      });
      const response = await this.bookRepository.save(newBook);
      return SuccessResponse('Book created successfully', response);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async editBook(id: number, bookDetails: BookInfo) {
    const book = await this.findBookById(id);
    const response = this.bookRepository.merge(book, bookDetails);
    await this.bookRepository.save(response);
    return SuccessResponse('Book updated successfully', response);
  }

  async deleteBook(id: number) {
    try {
      const book = await this.findBookById(id);
      const response = await this.bookRepository.delete({ id: book.id });
      return SuccessResponse('Book deleted successfully', response);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findBookById = async (id: number) => {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) throw new HttpException('Book not found', 404);
    return book;
  };
}
