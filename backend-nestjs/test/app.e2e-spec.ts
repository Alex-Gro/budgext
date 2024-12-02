import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateTransactionDto, EditTransactionDto } from '../src/transaction/dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3333);

    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'lustig@googlemail.com',
      password: '123'
    };
    describe('Signup', () => {
      it('Should throw if no body provided', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({})
          .expectStatus(400)
      });

      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
      });

      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            email: dto.email
          })
          .expectStatus(400)
      });

      it('Should signup', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody(dto)
          .expectStatus(201)
      });
    })


    describe('Login', () => {
      it('Should throw if no body provided', () => {
        return pactum
          .spec()
          .post(
            '/auth/login'
          ).withBody({})
          .expectStatus(400)
      });

      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/login'
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
      });

      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/login'
          ).withBody({
            email: dto.email
          })
          .expectStatus(400)
      });

      it('Should login', () => {
        return pactum
          .spec()
          .post(
            '/auth/login'
          ).withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/getUser')
/*
          .withBearerToken('$S{userAccessToken}')
*/
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = {
          firstname: 'Peter',
          email: 'peter@gmail.com',
        }
        return pactum
          .spec()
          .patch('/users')
          /*
                    .withBearerToken('$S{userAccessToken}')
          */
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstname)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Balances', () => {
    describe('Get users balance', () => {
      it('Should get users balance', () => {
        return pactum
          .spec()
          .get('/balances')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .inspect()
      });
    });
  });
  describe('Transactions', () => {
    describe('Get all transactions (empty)', () => {
      it('Should get array without transactions (empty)', () => {
        return pactum
          .spec()
          .get('/transactions')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create transaction', () => {
      const dto: CreateTransactionDto = {
        amount: 12.0,
        type: 'expense',
        title: 'Kleine Spende bitte!',
        date: new Date(Date.now()),
      };
      it('Should create a transaction', () => {
        return pactum
          .spec()
          .post('/transactions')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('transactionId', 'id')
          .inspect()
      });
    });
    describe('Get transaction by id', () => {
      it('Should get one transaction', () => {
        return pactum
          .spec()
          .get('/transactions/{id}')
          .withPathParams('id', '$S{transactionId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{transactionId}')
      });
    });
    describe('Edit transaction by id', () => {
      const dto: EditTransactionDto = {
        amount: 45.4
      };
      it('Should edit transaction', () => {
        return pactum
          .spec()
          .patch('/transactions/{id}')
          .withPathParams('id', '$S{transactionId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectBodyContains(dto.amount)
          .expectStatus(200)
      });
    });
    describe('Get all transactions', () => {
      it('Should get all transactions', () => {
        return pactum
          .spec()
          .get('/transactions')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Delete transaction by id', () => {
      it('Should delete one transaction', () => {
        return pactum
          .spec()
          .delete('/transactions/{id}')
          .withPathParams('id', '$S{transactionId}')
          // .withBearerToken('$S{userAccessToken}') would also be possible instead of .withHeaders({..})
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(204)
      });
    });
    describe('Get all transactions again with empty', () => {
      it('Should get empty transactions', () => {
        return pactum
          .spec()
          .get('/transactions')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
