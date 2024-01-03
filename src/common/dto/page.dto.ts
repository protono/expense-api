import {Type} from 'class-transformer'
import {IsNumber, IsOptional, Max, Min} from 'class-validator'

export class PageDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(25)
  take: number = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  skip: number = 0
}
