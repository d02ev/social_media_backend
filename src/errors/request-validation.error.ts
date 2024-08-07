import { HttpStatusCodes } from '../enums';
import { ValidationError } from 'class-validator';

export class RequestValidationError extends Error {
	public message: string;
	public status_code: number;
	public errors: ValidationError[];

	constructor(
		errors: ValidationError[],
		statusCode?: number,
		message?: string,
	) {
		super(message);
		this.message = message || 'Request validation failed.';
		this.status_code = statusCode || HttpStatusCodes.BAD_REQUEST;
		this.errors = errors;
	}
}
