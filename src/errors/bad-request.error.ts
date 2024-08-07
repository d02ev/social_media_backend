import { HttpStatusCodes } from '../enums';

export class BadRequestError extends Error {
	public message: string;
	public status_code: number;

	constructor(message: string, statusCode = HttpStatusCodes.BAD_REQUEST) {
		super(message);
		this.message = message;
		this.status_code = statusCode;
	}
}
