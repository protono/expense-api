import {IsEmail, IsString, MinLength} from 'class-validator'

export class AuthDTO {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(2)
  password: string
}
