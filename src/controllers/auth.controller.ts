import { CookieOptions, Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { AuthService } from '../services';
import { RequestValidationError } from '../errors';
import {
	LoginUserRequestDto,
	LogoutUserResponseDto,
	RegisterUserRequestDto,
} from '../dtos';
import { HttpStatusCodes } from '../enums';

export class AuthController {
	private readonly _auth_service: AuthService;
	private readonly _cookie_options: CookieOptions;

	constructor() {
		this._auth_service = new AuthService();
		this._cookie_options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};
	}

	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let request_body: RegisterUserRequestDto;
			if (req.file) {
				request_body = {
					...req.body,
					profile_img_attached: true,
					profile_img_name: req.file.filename,
					profile_img_buffer: req.file.buffer,
					profile_img_mime_type: req.file.mimetype,
				};
			} else {
				request_body = {
					...req.body,
				};
			}

			const register_user_request_dto = new RegisterUserRequestDto(
				request_body,
			);
			const validation_errors = await validate(register_user_request_dto);
			if (validation_errors && validation_errors.length > 0) {
				return next(new RequestValidationError(validation_errors));
			}

			const register_user_response_dto = await this._auth_service.registerUser(
				register_user_request_dto,
			);
			return res
				.status(HttpStatusCodes.CREATED)
				.json(register_user_response_dto);
		} catch (err: any) {
			return next(err);
		}
	};

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const request_body = { ...req.body };
			const login_user_request_dto = new LoginUserRequestDto(request_body);
			const validation_errors = await validate(login_user_request_dto);
			if (validation_errors && validation_errors.length > 0) {
				return next(new RequestValidationError(validation_errors));
			}

			const login_user_response_dto = await this._auth_service.loginUser(
				login_user_request_dto,
			);
			return res
				.status(HttpStatusCodes.OK)
				.cookie(
					'access_token',
					login_user_response_dto!.access_token,
					this._cookie_options,
				)
				.cookie(
					'refresh_token',
					login_user_response_dto!.refresh_token,
					this._cookie_options,
				)
				.json(login_user_response_dto);
		} catch (err: any) {
			return next(err);
		}
	};

	refreshAccessToken = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const refresh_token = req.cookies.refresh_token;
			const refresh_access_token_response_dto =
				await this._auth_service.refreshAccessToken(refresh_token);
			return res
				.status(HttpStatusCodes.OK)
				.cookie(
					'access_token',
					refresh_access_token_response_dto!.access_token,
					this._cookie_options,
				)
				.cookie('refresh_token', refresh_token, this._cookie_options)
				.json(refresh_access_token_response_dto);
		} catch (err: any) {
			return next(err);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	logout = async (_: Request, res: Response, next: NextFunction) => {
		try {
			return res
				.status(HttpStatusCodes.OK)
				.clearCookie('access_token')
				.clearCookie('refresh_token')
				.json(new LogoutUserResponseDto());
		} catch (err: any) {
			return next(err);
		}
	};
}
