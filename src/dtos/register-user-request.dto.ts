import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches } from 'class-validator';

export class RegisterUserRequestDto {
	@IsNotEmpty({ message: 'Full name is required.' })
  @IsString({ message: 'Full name must be a string.' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Full name must only contain letters and spaces.',
  })
  full_name!: string;

	@IsNotEmpty({ message: 'User name is required.' })
  @IsString({ message: 'User name must be a string.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'User name must only contain letters, numbers, and underscores.',
  })
  user_name!: string;

	@IsNotEmpty({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email!: string;

	@IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
    },
    {
      message: 'Password must be minimum 8 characters long with 1 upper and lower case alphabets, 1 numeric digit and 1 special symbol.',
    }
  )
  password!: string;

  profile_img_attached = false;
	profile_img_name?: string | undefined;
	profile_img_buffer?: Buffer | undefined;
	profile_img_mime_type?: string | undefined;

  constructor(obj: RegisterUserRequestDto) {
    Object.assign(this, obj);
  }
}
