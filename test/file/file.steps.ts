import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { File } from "../../src/file/file.entity";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileController } from "../../src/file/file.controller";
import { FileService } from "../../src/file/file.service";

let app: INestApplication;

BeforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                entities: [File],
                synchronize: true,
            }),
            TypeOrmModule.forFeature([File]),
        ],
        controllers: [FileController],
        providers: [FileService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
});

AfterAll(async () => {
    if (app) {
        await app.close();
    }
});

let response: request.Response;

Given('I send a POST request to {string} with the file {string}', async (url: string, filename: string) => {
    response = await request(app.getHttpServer())
        .post(url)
        .attach('file', `test/file/uploads/${filename}`);
});

Given('I send a POST request to {string} without a file', async (url: string) => {
    response = await request(app.getHttpServer()).post(url);
});

Then('the server should respond with a {int} status code', (statusCode: number) => {
    if (response.status !== statusCode) {
        throw new Error(`Expected status ${statusCode}, but received ${response.status}`);
    }
});

Then('the server response should contain the message {string}', (expectedMessage: string) => {
    const message = response.body.message;
    if (message !== expectedMessage) {
        throw new Error(`Expected message "${expectedMessage}", but received "${message}"`);
    }
});
