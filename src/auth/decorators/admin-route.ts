import {SetMetadata} from '@nestjs/common'

export const AdminRoute = () => SetMetadata('ADMIN_ROUTE', true)
