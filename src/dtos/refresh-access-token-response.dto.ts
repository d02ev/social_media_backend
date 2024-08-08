import { HttpStatusCodes } from '../enums';

export class RefreshAccessTokenResponseDto {
	private readonly status_code: number;
	public readonly access_token: string;

	constructor(accessToken: string) {
		this.status_code = HttpStatusCodes.OK;
		this.access_token = accessToken;
	}
}
