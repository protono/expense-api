import {Type} from 'class-transformer'
import {IsNumber, IsOptional, Max} from 'class-validator'

export class PageDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(25)
  take: number = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(5)
  skip: number = 0
}
