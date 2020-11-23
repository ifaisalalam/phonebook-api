import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AddContactDto } from '../src/phonebook/dto/add-contact.dto';
import * as faker from 'faker';
import { Phonebook } from '../src/phonebook/phonebook.entity';
import { SearchContactsDto } from '../src/phonebook/dto/search-contacts.dto';

describe('/phonebook (e2e)', () => {
  let app: INestApplication;
  const AUTH_TOKEN: string = process.env.AUTH_TOKEN;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/add (POST)', () => {
    const contact: AddContactDto = {
      name: faker.name.findName().substr(0, 100),
      phone: '+910000000000',
      email: faker.internet.exampleEmail().substr(0, 320),
    };

    it('should return authorization error when auth header is not set', () => {
      return request(app.getHttpServer())
        .post('/phonebook/add')
        .send(<AddContactDto>contact)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should add new contact and return it', () => {
      return request(app.getHttpServer())
        .post('/phonebook/add')
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send(<AddContactDto>contact)
        .expect(HttpStatus.CREATED);
    });

    it('should return HttpsStatus.CONFLICT if the email already exists', () => {
      return request(app.getHttpServer())
        .post('/phonebook/add')
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send(<AddContactDto>{
          ...contact,
          name: faker.name.findName(),
        })
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('/list (GET)', () => {
    it('should return authorization error when auth header is not set', () => {
      return request(app.getHttpServer())
        .get('/phonebook/list')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return list of contacts', () => {
      return request(app.getHttpServer())
        .get('/phonebook/list')
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });

  describe('/info/:id (GET)', () => {
    const contact: Partial<Phonebook> = {
      name: faker.name.findName().substr(0, 100),
      phone: '+910000000000',
      email: faker.internet.exampleEmail().substr(0, 320),
    };

    beforeAll(async () => {
      return request(app.getHttpServer())
        .post('/phonebook/add')
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send(<AddContactDto>contact)
        .expect(HttpStatus.CREATED)
        .expect(res => {
          contact.id = res.body.id;
        });
    });

    it('should return authorization error when auth header is not set', () => {
      return request(app.getHttpServer())
        .get(`/phonebook/info/${contact.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('it should return contact info given', async () => {
      return request(app.getHttpServer())
        .get(`/phonebook/info/${contact.id}`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect(res => {
          if (res.body.id !== contact.id) throw new Error();
        });
    });

    it('should return NOT_FOUND if the contact does not exist', () => {
      return request(app.getHttpServer())
        .get(`/phonebook/info/123456789abc12345678abc1`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/update/:id (PUT)', () => {
    const contact: Partial<Phonebook> = {
      name: faker.name.findName().substr(0, 100),
      phone: '+910000000001',
      email: faker.internet.exampleEmail().substr(0, 320),
    };

    beforeAll(async () => {
      return request(app.getHttpServer())
        .post('/phonebook/add')
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send(<AddContactDto>contact)
        .expect(HttpStatus.CREATED)
        .expect(res => {
          contact.id = res.body.id;
        });
    });

    it('should return authorization error when auth header is not set', () => {
      return request(app.getHttpServer())
        .put(`/phonebook/update/${contact.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should successfully update the contact data', () => {
      return request(app.getHttpServer())
        .put(`/phonebook/update/${contact.id}`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send(<Partial<Phonebook>>{
          name: faker.name.findName().substr(0, 100),
          email: faker.internet.exampleEmail().substr(0, 320),
          phone: '+910000000003',
        })
        .expect(HttpStatus.OK)
        .expect(res => {
          if (res.body.id !== contact.id) throw new Error();
          if (res.body.name === contact.name) throw new Error();
          if (res.body.email === contact.email) throw new Error();
          if (res.body.phone == contact.phone) throw new Error();
        });
    });

    it('should return BAD_REQUEST on invalid input', () => {
      return request(app.getHttpServer())
        .put(`/phonebook/update/${contact.id}`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send({
          name: 1234,
          email: '910000000004',
          phone: faker.internet.email(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return NOT_FOUND if :id is invalid', () => {
      return request(app.getHttpServer())
        .put(`/phonebook/update/123456789abc12345678abc1`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send({
          name: faker.name.findName(),
          email: faker.internet.exampleEmail(),
          phone: '910000000005',
        })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/search (GET)', () => {
    it('should return authorization error when auth header is not set', () => {
      return request(app.getHttpServer())
        .get('/phonebook/search')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return matching results by name', () => {
      return request(app.getHttpServer())
        .get(`/phonebook/search?property=name&value=a`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect(res => {
          if ([undefined, null].includes(res.body.results)) throw new Error();
          if ([undefined, null].includes(res.body.count_page_results))
            throw new Error();
          if ([undefined, null].includes(res.body.current_page))
            throw new Error();
          if ([undefined, null].includes(res.body.total_pages))
            throw new Error();
          if ([undefined, null].includes(res.body.count_results))
            throw new Error();
        });
    });

    it('should return matching results by email', () => {
      return request(app.getHttpServer())
        .get(`/phonebook/search?property=email&value=@`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect(res => {
          if ([undefined, null].includes(res.body.results)) throw new Error();
          if ([undefined, null].includes(res.body.count_page_results))
            throw new Error();
          if ([undefined, null].includes(res.body.current_page))
            throw new Error();
          if ([undefined, null].includes(res.body.total_pages))
            throw new Error();
          if ([undefined, null].includes(res.body.count_results))
            throw new Error();
        });
    });

    it('should throw BAD_REQUEST if tried searching with other properties', () => {
      return request(app.getHttpServer())
        .get(`/phonebook/search?property=phone&value=1`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/delete/:id (DELETE)', () => {
    const contact: Partial<Phonebook> = {
      name: faker.name.findName().substr(0, 100),
      email: faker.internet.exampleEmail().substr(0, 320),
    };

    beforeAll(async () => {
      return request(app.getHttpServer())
        .post('/phonebook/add')
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .send(<AddContactDto>contact)
        .expect(HttpStatus.CREATED)
        .expect(res => {
          contact.id = res.body.id;
        });
    });

    it('should return authorization error when auth header is not set', () => {
      return request(app.getHttpServer())
        .delete('/phonebook/delete/123abc123abc123abc123abc')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should delete an existing contact', () => {
      return request(app.getHttpServer())
        .delete(`/phonebook/delete/${contact.id}`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect(res => {
          if (res.body.success !== true) throw new Error();
        });
    });

    it('should throw 404 if contact does not exist (already)', () => {
      return request(app.getHttpServer())
        .delete(`/phonebook/delete/123abc123abc123abc123abc`)
        .auth(AUTH_TOKEN, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
