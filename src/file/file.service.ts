import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    public async upload(file: Express.Multer.File): Promise<File> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const fileData: Partial<File> = {
            name: file.originalname,
            path: `./uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
            isPublic: false,
        };

        return await this.save(fileData);
    }

    async save(file: Partial<File>): Promise<File> {
        return await this.fileRepository.save(this.fileRepository.create(file));
    }
}
