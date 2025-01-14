import { Given, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let app: INestApplication;
let response: request.Response;

Given('I send a GET request to {string}', async (url: string) => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    response = await request(app.getHttpServer()).get(url);
});

Then('I receive a {int} status code and the message {string}', async (statusCode: number, message: string) => {
    await request(app.getHttpServer())
        .get('/')
        .expect(statusCode)
        .expect(message);

    await app.close();
});
