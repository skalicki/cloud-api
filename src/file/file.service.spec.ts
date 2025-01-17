import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from './file.service';
import { File } from './file.entity';

describe('FileService', () => {
  let service: FileService;
  let repository: Repository<File>;

  beforeEach(async () => {
    const repositoryMock = {
      save: jest.fn().mockImplementation((file) => Promise.resolve({ ...file, id: 1 })),
      create: jest.fn().mockImplementation((file) => ({ ...file })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getRepositoryToken(File),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    repository = module.get<Repository<File>>(getRepositoryToken(File));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should save file information into the database', async () => {
    const fileData: Partial<File> = {
      name: 'example.txt',
      path: './uploads/example.txt',
      mimeType: 'text/plain',
      size: 100,
    };

    const savedFile = await service.save(fileData);

    expect(repository.create).toHaveBeenCalledWith(fileData);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(fileData));
    expect(savedFile.id).toBe(1);
  });
});
