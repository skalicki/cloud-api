import { Given, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

let app: INestApplication;
let response: request.Response;

Given('I send a POST request to {string} with the file {string}', async (url: string, filename: string) => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    response = await request(app.getHttpServer())
        .post(url)
        .attach('file', `test/file/uploads/${filename}`);
});

Given('I send a POST request to {string} without a file', async (url: string) => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

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
