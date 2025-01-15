import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async save(file: Partial<File>): Promise<File> {
        return await this.fileRepository.save(this.fileRepository.create(file));
    }
}
