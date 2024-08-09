import { HttpStatusCodes } from '../enums';

export class RegisterUserResponseDto {
  private readonly status_code: number;
  private readonly message: string;

  constructor() {
    this.status_code = HttpStatusCodes.CREATED;
    this.message = 'User registered successfully and a verification email has been sent to your email address.';
  }
}