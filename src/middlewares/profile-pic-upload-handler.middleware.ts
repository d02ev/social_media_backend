import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { MediaUploadUtil } from '../utils';
import { AppError, BadRequestError } from '../errors';
import { AppErrorCodes } from '../enums';

export const profileImageUploadHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	new MediaUploadUtil('profileImage').upload.single('profileImage')(req, res, (err: any) => {
		if (err) {
			if (err instanceof MulterError) {
				switch (err.code) {
					case 'LIMIT_FILE_SIZE':
					case 'LIMIT_FILE_COUNT':
					case 'LIMIT_UNEXPECTED_FILE':
						throw new BadRequestError(err.message);
					default:
						throw new AppError(err.message, AppErrorCodes.UNKNOWN_MULTER_ERROR);
				}
			}

			throw new AppError(err.message, AppErrorCodes.UNKNOWN_APP_ERROR);
		}

		return next();
	});
};
