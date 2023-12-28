import {ExecutionContext, createParamDecorator} from '@nestjs/common'
import {Request} from 'express'
import {UserSession} from '../types'

export const GetUserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest() as Request
  const session = request.session as UserSession

  return Number(session.user?.id)
})
