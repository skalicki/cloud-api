import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import * as path from 'path';
import { File } from './file.entity';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const ext = path.extname(file.originalname);
                const uniqueName = `${v4()}${ext}`;
                callback(null, uniqueName);
            },
        }),
    }))
    async upload(@UploadedFile() file: Express.Multer.File) {
        return { message: 'Upload successful', file: await this.fileService.upload(file) };
    }
}
