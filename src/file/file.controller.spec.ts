import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

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
  });

  it('should upload a file and return success message', async () => {
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

    const response = await controller.upload(file);
    expect(response).toEqual({
      message: 'Upload successful',
      file: expect.objectContaining({ name: file.originalname }),
    });

    expect(repository.save).toHaveBeenCalledWith({
      name: file.originalname,
      path: `./uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
      isPublic: false,
    });
  });

  it('should upload a file with a unique filename', async () => {
    const file1 = {
      fieldname: 'file',
      originalname: 'testfile1.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 100,
      stream: undefined,
      destination: path.resolve(__dirname, '../../../uploads'),
      filename: `${v4()}-testfile1.txt`,
      path: '',
      buffer: Buffer.from('Hello, world!'),
    };

    const file2 = {
      ...file1,
      filename: `${v4()}-testfile1.txt`,
    };

    const response1 = await controller.upload(file1);
    const response2 = await controller.upload(file2);

    expect(response1.file.path).not.toEqual(response2.file.path);
  });

  it('should throw an error if no file is uploaded', async () => {
    try {
      await controller.upload(null);
    } catch (error) {
      expect(error.message).toContain('No file uploaded');
    }
  });
});
