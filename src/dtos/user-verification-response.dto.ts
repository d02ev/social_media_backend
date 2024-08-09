import { HttpStatusCodes } from '../enums';

export class UserVerificationResponseDto {
	private readonly status_code: number;
	private readonly message: string;

	constructor() {
		this.status_code = HttpStatusCodes.OK;
		this.message = 'User verified successfully.';
	}
}
