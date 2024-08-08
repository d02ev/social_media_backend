import { HttpStatusCodes } from '../enums';

export class LoginUserResponseDto {
	private readonly status_code: number;
	public readonly access_token: string;
	public readonly refresh_token: string;

	constructor(accessToken: string, refreshToken: string) {
		this.status_code = HttpStatusCodes.OK;
		this.access_token = accessToken;
		this.refresh_token = refreshToken;
	}
}
