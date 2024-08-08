import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import { BadRequestError } from '../errors';

export class MediaUploadUtil {
	public readonly upload!: Multer;
	private readonly _multer_options: multer.Options;

	constructor(mediaType: 'post' | 'profileImage') {
		this._multer_options = {
			storage: multer.memoryStorage(),
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
				cb(null, true);
			},
		};

		if (mediaType === 'post') {
			this._multer_options.limits = { fileSize: 1024 * 1024 * 5 };
		} else {
			this._multer_options.limits = { fileSize: 1024 * 1024 * 2 };
		}

		this.upload = multer(this._multer_options);
	}
}
