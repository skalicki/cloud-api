import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
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
                const uniqueName = `${v4()}-${file.originalname}`;
                callback(null, uniqueName);
            },
        }),
    }))
    async upload(@UploadedFile() file: Express.Multer.File) {
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

        const savedFile = await this.fileService.save(fileData);

        return { message: 'Upload successful', file: savedFile };
    }
}
