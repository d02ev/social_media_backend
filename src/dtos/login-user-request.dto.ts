import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequestDto {
	@IsNotEmpty({ message: 'User name is required.' })
  @IsString({ message: 'User name must be a string.' })
	user_name!: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
	password!: string;

  constructor(obj: LoginUserRequestDto) {
    Object.assign(this, obj);
  }
}
