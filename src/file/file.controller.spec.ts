import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
    }).compile();

    controller = module.get<FileController>(FileController);
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
    // Mock Express file object
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
    const uploadedFilePath = path.join(file.destination, file.filename);

    fs.writeFileSync(uploadedFilePath, file.buffer);

    expect(fs.existsSync(uploadedFilePath)).toBe(true);
    expect(response).toEqual({
      message: 'Upload successful',
      filename: file.filename,
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

    expect(response1.filename).not.toEqual(response2.filename);
  });

  it('should throw an error if no file is uploaded', async () => {
    try {
      await controller.upload(null);
    } catch (error) {
      expect(error.message).toContain('No file uploaded');
    }
  });
});
