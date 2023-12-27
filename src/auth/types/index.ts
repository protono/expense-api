import {Session} from 'express-session'

type UserSessionData = {
  id: number
  email: string
}
export type UserSession = Session & Record<'user', UserSessionData>
