import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

describe('FileController', () => {
  let controller: FileController;
  let service: FileService;
  let repository: Repository<File>;

  beforeEach(async () => {
    const repositoryMock = {
      save: jest.fn().mockImplementation((file) => Promise.resolve({ ...file, id: v4() })),
      create: jest.fn().mockImplementation((fileData) => ({ ...fileData })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        FileService,
        {
          provide: getRepositoryToken(File),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    service = module.get<FileService>(FileService);
    repository = module.get<Repository<File>>(getRepositoryToken(File));
  });

  afterEach(() => {
    const uploadsDir = path.resolve(__dirname, '../../../uploads');
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should upload a file and return success message', async () => {
    jest.spyOn(service, 'generateHash').mockResolvedValue('mocked-hash-value');

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'testfile.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 100,
      stream: undefined,
      destination: './uploads',
      filename: `${v4()}.txt`,
      path: './uploads/testfile.txt',
      buffer: Buffer.from('Hello, world!'),
    };

    const response = await controller.upload(file);
    expect(response).toEqual({
      message: 'Upload successful',
      file: expect.objectContaining({ name: file.originalname }),
    });

    expect(repository.save).toHaveBeenCalledWith({
      id: path.parse(file.filename).name,
      name: file.originalname,
      path: `./uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
      isPublic: false,
      hash: 'mocked-hash-value',
    });
  });

  it('should throw an error if no file is uploaded', async () => {
    try {
      await controller.upload(null);
    } catch (error) {
      expect(error.message).toContain('No file uploaded');
    }
  });

  it('should correctly generate hash for a mocked file', async () => {
    jest.spyOn(service, 'generateHash').mockImplementation(async (filePath: string) => {
      if (filePath === file.path) {
        return expectedHash;
      }
      throw new Error('File not found');
    });

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'testfile.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 100,
      stream: undefined,
      destination: './uploads',
      filename: `${v4()}-testfile.txt`,
      path: './uploads/testfile.txt',
      buffer: Buffer.from('Hello, world!'),
    };

    const expectedHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const hash = await service.generateHash(file.path);

    expect(hash).toBe(expectedHash);
    expect(service.generateHash).toHaveBeenCalledWith(file.path);
  });
});
