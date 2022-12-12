import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import jwt_decode from 'jwt-decode';

import IUser from '../src/users/interfaces/user';
import IShoppingList from 'src/shoppinglist/interfaces/shopping-list';

describe('Shopping list API', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  const loginCreds: IUser = {
    email: 'testuser@gmail.com',
    password: process.env.TEST_PW,
  };
  const loginCredsEditor: IUser = {
    email: 'testeditor@gmail.com',
    password: process.env.TEST_E_PW,
  };
  const listDto: any = {
    name: 'Shopping list name',
    items: [
      {
        name: 'Item name',
        quantity: 2,
        done: false,
      },
    ],
  };
  let ownerToken: string;
  let editorToken: string;
  let editorId: string;
  let listId: string;

  it('login user - owner', async () => {
    const test = await request(app.getHttpServer())
      .post('/user/login')
      .send(loginCreds);
    expect(test.statusCode).toBe(200);
    ownerToken = test.body.token;
  });
  it('login user - editor', async () => {
    const test = await request(app.getHttpServer())
      .post('/user/login')
      .send(loginCredsEditor);

    editorToken = test.body.token;
    const decoded: any = jwt_decode(editorToken);
    editorId = decoded?.user._id;

    expect(test.statusCode).toBe(200);
  });
  it('Create new shopping list', async () => {
    const test = await request(app.getHttpServer())
      .post('/shoppinglist')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(listDto);
    listId = test.body.data._id;
    expect(test.statusCode).toBe(201);
  });
  it('Create new shopping list, unauthorized', async () => {
    const test = await request(app.getHttpServer())
      .post('/shoppinglist')
      .send(listDto);
    expect(test.statusCode).toBe(403);
  });
  it('add editor to shopping list', async () => {
    const test = await request(app.getHttpServer())
      .post(`/shoppinglist/${listId}/editor`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ editorId });
    expect(test.statusCode).toBe(201);
  });
  it('add editor to shopping list, unauthorized', async () => {
    const test = await request(app.getHttpServer())
      .post(`/shoppinglist/${listId}/editor`)

      .send({ editorId });
    expect(test.statusCode).toBe(403);
  });
  it('add item to shopping list as owner', async () => {
    const test = await request(app.getHttpServer())
      .post(`/shoppinglist/${listId}/item`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Owner Item' });
    expect(test.statusCode).toBe(201);
  });
  it('add item to shopping list as editor', async () => {
    const test = await request(app.getHttpServer())
      .post(`/shoppinglist/${listId}/item`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'Editor Item' });
    expect(test.statusCode).toBe(201);
  });
  it('add item to shopping, unauthorized', async () => {
    const test = await request(app.getHttpServer())
      .post(`/shoppinglist/${listId}/item`)
      .send({ name: 'Unauthorized Item' });
    expect(test.statusCode).toBe(403);
  });
  it('get shopping list by id as owner', async () => {
    const test = await request(app.getHttpServer())
      .get(`/shoppinglist/${listId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(test.statusCode).toBe(200);
  });
  it('get shopping list by id as editor', async () => {
    const test = await request(app.getHttpServer())
      .get(`/shoppinglist/${listId}`)
      .set('Authorization', `Bearer ${editorToken}`);
    expect(test.statusCode).toBe(200);
  });
  it('get shopping list by id, unauthorized', async () => {
    const test = await request(app.getHttpServer()).get(
      `/shoppinglist/${listId}`,
    );

    expect(test.statusCode).toBe(403);
  });
  it('delete shopping list as editor, unauthorized', async () => {
    const test = await request(app.getHttpServer())
      .delete(`/shoppinglist/${listId}`)
      .set('Authorization', `Bearer ${editorToken}`);

    expect(test.statusCode).toBe(403);
  });
  it('delete shopping list', async () => {
    const test = await request(app.getHttpServer())
      .delete(`/shoppinglist/${listId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(test.statusCode).toBe(204);
  });
});
