import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import {
	LoginUserRequestDto,
	LoginUserResponseDto,
	RefreshAccessTokenResponseDto,
	RegisterUserRequestDto,
	RegisterUserResponseDto,
	UserVerificationResponseDto,
	ValidatedUserResultDto,
} from '../dtos';
import { AppErrorCodes } from '../enums';
import { AppError, BadRequestError, NotFoundError } from '../errors';
import { PasswordDetailRepository, UserRepository } from '../repository';
import { AuthUtil, MailUtil, SupabaseUtil } from '../utils';
import { JwtPayload } from 'jsonwebtoken';
import { Helper } from '../helpers';

export class AuthService {
	private readonly _user_repository: UserRepository;
	private readonly _password_detail_repository: PasswordDetailRepository;
	private readonly _auth_util: AuthUtil;
	private readonly _supabase_util: SupabaseUtil;
	private readonly _mail_util: MailUtil;
	private readonly _helper: Helper;

	constructor() {
		this._user_repository = new UserRepository();
		this._password_detail_repository = new PasswordDetailRepository();
		this._auth_util = new AuthUtil();
		this._supabase_util = new SupabaseUtil();
		this._mail_util = new MailUtil();
		this._helper = new Helper();
	}

	registerUser = async (
		registerUserRequestDto: RegisterUserRequestDto,
	): Promise<RegisterUserResponseDto | undefined> => {
		try {
			const { full_name, user_name, email, password, profile_img_attached } =
				registerUserRequestDto;
			const pass_hash = await this._auth_util.createPassHash(password);
			const verification_hash = this._auth_util.genVerificationToken();

			if (profile_img_attached) {
				const { profile_img_name, profile_img_buffer, profile_img_mime_type } =
					registerUserRequestDto;
				const custom_profile_img_name = this._helper.genCustomFileName(
					profile_img_name!,
				);
				const { error } = await this._supabase_util.uploadNewMedia(
					'profileImage',
					custom_profile_img_name,
					profile_img_buffer!,
					profile_img_mime_type!,
				);

				if (error) {
					throw new AppError(
						error.message,
						AppErrorCodes.SB_UPLOAD_ERROR,
						error.stack,
					);
				}

				const profile_img_url = this._supabase_util.fetchMediaUrl(
					'profileImage',
					profile_img_name!,
				);
				await this._user_repository.createUser(
					full_name,
					user_name,
					email,
					pass_hash,
					verification_hash,
					profile_img_url,
					profile_img_name,
				);
			} else {
				await this._user_repository.createUser(
					full_name,
					user_name,
					email,
					pass_hash,
					verification_hash,
				);
			}

			const verification_url =
				this._helper.genVerificationLink(verification_hash);
			await this._mail_util.sendVerificationMail(email, verification_url);

			return new RegisterUserResponseDto();
		} catch (err: any) {
			if (err instanceof AppError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}
			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	};

	loginUser = async (
		loginUserRequestDto: LoginUserRequestDto,
	): Promise<LoginUserResponseDto | undefined> => {
		try {
			const { user_name } = loginUserRequestDto;
			const user = await this._user_repository.fetchUserByUsername(user_name);

			if (!user) {
				throw new NotFoundError('User does not exist.');
			}

			const access_token_payload: JwtPayload = {
				sub: user.id,
			};
			const refresh_token_payload: JwtPayload = {
				sub: user.id,
			};
			const access_token = this._auth_util.genAccessToken(access_token_payload);
			const refresh_token = this._auth_util.genRefreshToken(
				refresh_token_payload,
			);

			await this._password_detail_repository.createRefreshToken(
				user.id,
				refresh_token,
			);
			return new LoginUserResponseDto(access_token, refresh_token);
		} catch (err: any) {
			if (err instanceof NotFoundError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}
			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	};

	verifyUser = async (verificationHash: string) => {
		try {
			if (!this._auth_util.decodeToken(verificationHash)) {
				throw new BadRequestError('Invalid URL.');
			}
			const password_details =
				await this._password_detail_repository.fetchPasswordDetailsByVerificationHash(
					verificationHash,
				);
			if (!password_details) {
				throw new NotFoundError('User does not exist.');
			}

			const user_id = password_details.userId;
			await this._user_repository.updateUserVerificationStatus(user_id);

			return new UserVerificationResponseDto();
		} catch (err: any) {
			if (err instanceof BadRequestError || err instanceof NotFoundError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	};

	refreshAccessToken = async (
		refreshToken: string,
	): Promise<RefreshAccessTokenResponseDto | undefined | null> => {
		try {
			const decoded_refresh_token_payload =
				this._auth_util.decodeToken(refreshToken);
			if (!decoded_refresh_token_payload) {
				throw new BadRequestError('Invalid refresh token.');
			}

			const user_id = decoded_refresh_token_payload.sub!;
			const user = await this._user_repository.fetchUserById(user_id as string);
			if (!user) {
				throw new NotFoundError('User does not exist.');
			}

			const user_refresh_token = user.passwordDetail?.refreshToken;
			if (user_refresh_token !== refreshToken) {
				throw new BadRequestError('Invalid refresh token.');
			}

			const access_token_payload: JwtPayload = {
				sub: user.id,
			};
			const new_access_token =
				this._auth_util.genAccessToken(access_token_payload);

			return new RefreshAccessTokenResponseDto(new_access_token);
		} catch (err: any) {
			if (err instanceof BadRequestError || err instanceof NotFoundError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	};

	validateUserLocal = async (
		userName: string,
		password: string,
	): Promise<ValidatedUserResultDto | undefined | null> => {
		try {
			const user = await this._user_repository.fetchUserByUsername(userName);
			if (!user) {
				return null;
			}

			const pass_match = await this._auth_util.comparePassHash(
				password,
				user.passwordDetail?.passwordHash!,
			);
			if (!pass_match) {
				return null;
			}

			const validatedUserResultDto: ValidatedUserResultDto = {
				id: user.id,
				email: user.email,
			};
			return validatedUserResultDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	};

	validateUserJwt = async (
		jwtPayload: JwtPayload,
	): Promise<ValidatedUserResultDto | undefined | null> => {
		try {
			const user = await this._user_repository.fetchUserById(jwtPayload.sub!);
			if (!user) {
				return null;
			}

			const validatedUserResultDto: ValidatedUserResultDto = {
				id: user.id,
				email: user.email,
			};
			return validatedUserResultDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	};
}
