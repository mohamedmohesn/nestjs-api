import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module"
import * as pactum from 'pactum';
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3000)

    prisma = app.get(PrismaService)
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000/')
  });
  afterAll(() => {
    app.close();
  })
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'mohesn@yahoo.com',
      password: '123'
    }
    describe('signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400)
      })

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .expectStatus(400)
      })

      it('should signup', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })
    })

    describe('signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400)
      })

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .expectStatus(400)
      })

      it('should signin', () => {

        return pactum
          .spec()
          .post('auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      })
    })
  })

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    })

    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName:'mohesn',
        email: 'mohesn3@yahoo.com',
        
      }
      it('should get Edit user', () => {
        return pactum
          .spec()
          .patch('users/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(
            dto
          )
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmark', () => {

    describe('Get empty Bookmarks', () => {
      it('should get empty Bookmark', () => { 
        return pactum
        .spec()
        .get('bookmarks/get')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBody([])
        })
     })

    describe('Create Bookmarks', () => { 
      const dto:CreateBookmarkDto={
        title:'first bookmark',
        link:'https://www.youtube.com/watch?v=GHTA143_b-s'
      }
      it('should Create Bookmarks', () => {
        return pactum
        .spec()
        .post('bookmarks/create')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .withBody({
          ...dto
        })
        .expectStatus(201)
        .stores('bookmarkid','id')
       }) 
    })

    describe('Get Bookmarks', () => { 
      it('should get all Bookmarks', () => { 
        return pactum
        .spec()
        .get('bookmarks/get')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectJsonLength(1)
        })
       })
     

    describe('Get Bookmarks by id', () => { 
      it('should get Bookmarks by ids', () => { 
        return pactum
        .spec()
        .get('bookmarks/ByID/{id}')
        .withPathParams('id','$S{bookmarkid}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkid}')
        })
    })

    describe('Edit Bookmark by id', () => {
      const dto:EditBookmarkDto={
        title:'NestJs Course for Beginners - Create a REST API',
        description:' Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques.'
      }
      it('should Edit bookmark', () => {
        return pactum
          .spec()
          .patch('bookmarks/edit/{id}')
          .withPathParams('id','$S{bookmarkid}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(
            dto
          )
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      })
     })

    describe('Delete Bookmark by id', () => { 
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('bookmarks/delete/{id}')
          .withPathParams('id','$S{bookmarkid}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
         
          .expectStatus(204)
         
      })
    })
    describe('Get empty Bookmarks', () => {
      it('should get empty Bookmark', () => { 
        return pactum
        .spec()
        .get('bookmarks/get')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBody([])
        })
     })
  })

})