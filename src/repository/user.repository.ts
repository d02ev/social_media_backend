import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

export class UserRepository {
	private readonly _db_service: DatabaseService;

	constructor() {
		this._db_service = new DatabaseService();
	}

	createUser = async (
		fullName: string,
		userName: string,
		email: string,
		passwordHash: string,
		imgUrl?: string,
		imgName?: string,
	): Promise<User | null | undefined> => {
		return await this._db_service.user.create({
			data: {
				fullName,
				userName,
				email,
				passwordDetail: {
					connectOrCreate: {
						create: { passwordHash },
						where: { passwordHash },
					},
				},
				profileImage: {
					create: {
						imgName,
						imgUrl,
					},
				},
			},
		});
	};

	fetchUserById = async (
		id: string,
	): Promise<
		| Prisma.UserGetPayload<{
				include: {
					profileImage: true;
					passwordDetail: true;
					posts: true;
					comments: true;
					reactions: true;
					followers: true;
					following: true;
				};
		  }>
		| null
		| undefined
	> => {
		return await this._db_service.user.findUnique({
			where: { id },
			include: {
				profileImage: true,
				passwordDetail: true,
				posts: true,
				comments: true,
				reactions: true,
				followers: true,
				following: true,
			},
		});
	};

	fetchUserByUsername = async (
		userName: string,
	): Promise<
		| Prisma.UserGetPayload<{
				include: {
					profileImage: true;
					passwordDetail: true;
					posts: true;
					comments: true;
					reactions: true;
					followers: true;
					following: true;
				};
		  }>
		| null
		| undefined
	> => {
		return await this._db_service.user.findUnique({
			where: { userName },
			include: {
				profileImage: true,
				passwordDetail: true,
				posts: true,
				comments: true,
				reactions: true,
				followers: true,
				following: true,
			},
		});
	};

	fetchUserByEmail = async (
		email: string,
	): Promise<
		| Prisma.UserGetPayload<{
				include: {
					profileImage: true;
					passwordDetail: true;
					posts: true;
					comments: true;
					reactions: true;
					followers: true;
					following: true;
				};
		  }>
		| null
		| undefined
	> => {
		return await this._db_service.user.findUnique({
			where: { email },
			include: {
				profileImage: true,
				passwordDetail: true,
				posts: true,
				comments: true,
				reactions: true,
				followers: true,
				following: true,
			},
		});
	};
}
