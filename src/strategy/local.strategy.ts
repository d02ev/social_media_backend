import { PassportStatic } from 'passport';
import { IStrategyOptions, IVerifyOptions, Strategy } from 'passport-local';
import { AuthService } from '../services';
import { ValidatedUserResultDto } from '../dtos';

export const localStrategy = (passport: PassportStatic) => {
	const auth_service = new AuthService();
	const local_options: IStrategyOptions = {
		usernameField: 'user_name',
		passwordField: 'password',
		session: false,
	};

	passport.use(
		new Strategy(
			local_options,
			(
				userName: string,
				password: string,
				done: (
					error: any,
					user?: Express.User | false,
					options?: IVerifyOptions,
				) => void,
			) => {
				auth_service
					.validateUserLocal(userName, password)
					.then((user: ValidatedUserResultDto | undefined | null) => {
						if (user) {
							return done(null, user);
						}

						return done(null, false);
					})
					.catch((err: any) => {
						return done(err, false);
					});
			},
		),
	);
};
