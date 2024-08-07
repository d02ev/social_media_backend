import { HttpStatusCodes } from '../enums';

export class InternalServerError extends Error {
	public message: string;
	public status_code: number;

	constructor(
		message: string,
		statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
	) {
		super(message);
		this.message = message;
		this.status_code = statusCode;
	}
}
