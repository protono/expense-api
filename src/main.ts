import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    session({
      secret: 'a3f99b00-8c95-4556-b8a2-fa5b7c086411',
      resave: false,
      saveUninitialized: false,
    }),
  )
  await app.listen(7357)
}
bootstrap()
