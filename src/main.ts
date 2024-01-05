import {AppModule} from './app.module'
import {NestFactory} from '@nestjs/core'
import {ValidationPipe} from '@nestjs/common'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import {createClient} from 'redis'
import {ConfigService} from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const redisClient = createClient({
    url: configService.getOrThrow('REDIS_URL'),
  })
  redisClient.on('error', (err) => {
    console.log(`Error ${err} while connecting to Redis`)
  })
  redisClient.connect()
  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
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
