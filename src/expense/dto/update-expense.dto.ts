import {IsDateString, IsOptional, IsString} from 'class-validator'

export class UpdateExpenseDTO {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  amount?: string

  @IsOptional()
  @IsDateString()
  date?: Date
}
