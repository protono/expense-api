import {AppModule} from './app.module'
import {NestFactory} from '@nestjs/core'
import {ValidationPipe} from '@nestjs/common'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import {createClient} from 'redis'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const redisClient = createClient({
    url: 'redis://localhost:6379',
  })
  redisClient.on('error', (err) => {
    console.log(`Error ${err} while connecting to Redis`)
  })
  redisClient.connect()
  app.use(
    session({
      secret: 'a3f99b00-8c95-4556-b8a2-fa5b7c086411',
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        ttl: 60000,
      }),
    }),
  )
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  await app.listen(7357)
}

bootstrap()
