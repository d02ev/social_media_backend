import { HttpStatusCodes } from '../enums';

export class UnauthorizedError extends Error {
	public message: string;
	public status_code: number;

	constructor(message: string, statusCode = HttpStatusCodes.UNAUTHORIZED) {
		super(message);
		this.message = message;
		this.status_code = statusCode;
	}
}
