import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {Request} from 'express'
import {Observable} from 'rxjs'
import {UserSession} from '../types'
import {Reflector} from '@nestjs/core'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    const session = request.session as UserSession

    const isRoutePublic = this.reflector.getAllAndOverride('PUBLIC_ROUTE', [context.getHandler(), context.getClass()])

    if (isRoutePublic) return true

    if (!session.user) throw new UnauthorizedException('The session is missing')

    return true
  }
}
