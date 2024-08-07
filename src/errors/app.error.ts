import { HttpStatusCodes } from '../enums';

export class AppError extends Error {
	public message: string;
	public status_code: number;
	public error_code: string;
	public stack: string | undefined;

	constructor(message: string, errorCode: string, stack?: string | undefined) {
		super(message);
		this.message = message;
		this.error_code = errorCode;
		this.status_code = HttpStatusCodes.INTERNAL_SERVER_ERROR;
		this.stack = stack || Error.captureStackTrace(this, this.constructor)!;
	}
}
