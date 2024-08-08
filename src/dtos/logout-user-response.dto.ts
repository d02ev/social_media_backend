import { HttpStatusCodes } from '../enums';

export class LogoutUserResponseDto {
	private readonly status_code: number;
	private readonly message: string;

	constructor() {
		this.status_code = HttpStatusCodes.OK;
		this.message = 'User logged out successfully.';
	}
}
