import { HttpStatusCodes } from '../enums';

export class ForbiddenError extends Error {
	public message: string;
	public status_code: number;

	constructor(message: string, statusCode = HttpStatusCodes.FORBIDDEN) {
		super(message);
		this.message = message;
		this.status_code = statusCode;
	}
}
