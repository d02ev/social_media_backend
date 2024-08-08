import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import { BadRequestError } from '../errors';

export class MediaUploadUtil {
	public readonly upload!: Multer;

	constructor(mediaType: 'post' | 'profileImage') {
		switch (mediaType) {
			case 'post':
				this.upload = multer({
					storage: multer.memoryStorage(),
					limits: { fileSize: 1024 * 1024 * 5 },
					fileFilter: (
						req: Request,
						file: Express.Multer.File,
						cb: FileFilterCallback,
					) => {
						const allowed_mime_types = ['image/jpg', 'image/png', 'image/jpeg'];
						if (!allowed_mime_types.includes(file.mimetype)) {
							cb(
								new BadRequestError(
									'Invalid file type only JPG, JPEG and PNG types allowed.',
								),
							);
						}
					},
				});
				break;
			case 'profileImage':
				this.upload = multer({
					storage: multer.memoryStorage(),
					limits: { fileSize: 1024 * 1024 * 2 },
					fileFilter: (
						req: Request,
						file: Express.Multer.File,
						cb: FileFilterCallback,
					) => {
						const allowed_mime_types = ['image/jpg', 'image/png', 'image/jpeg'];
						if (!allowed_mime_types.includes(file.mimetype)) {
							cb(
								new BadRequestError(
									'Invalid file type only JPG, JPEG and PNG types allowed.',
								),
							);
						}
					},
				});
				break;
		}
	}
}
