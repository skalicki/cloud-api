import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async upload(file: Express.Multer.File): Promise<File> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const fileData: Partial<File> = {
            id: path.parse(file.filename).name,
            name: file.originalname,
            path: `./uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
            isPublic: false,
            hash: await this.generateHash(`./uploads/${file.filename}`),
        };

        try {
            return await this.save(fileData);
        } catch (error) {
            if (
                error.code === '23505' || // PostgreSQL & CockroachDB
                error.code === '1062' || // MySQL & MariaDB
                error.code === '19' || // SQLite
                error.number === 2627 || // MSSQL
                error.number === 2601 || // MSSQL (index-based UNIQUE constraint)
                (error.message && error.message.includes('ORA-00001')) // Oracle
            ) {
                await this.deleteFile(fileData.path);
                throw new BadRequestException(
                    `File with the same content already exists (hash conflict)`
                );
            }
            throw error;
        }
    }

    async generateHash(path:string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(path);

            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (err) => reject(err));
        });
    }

    async save(file: Partial<File>): Promise<File> {
        return await this.fileRepository.save(this.fileRepository.create(file));
    }

    private async deleteFile(filePath: string): Promise<void> {
        try {
            await fs.promises.unlink(filePath);
        } catch (err) {
            console.error(`Failed to delete file at ${filePath}:`, err.message);
        }
    }
}
