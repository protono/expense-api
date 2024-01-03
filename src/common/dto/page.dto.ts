import {Type} from 'class-transformer'
import {IsNumber, IsOptional} from 'class-validator'

export class PageDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  take: number = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip: number = 0
}
