import { DoneCallback, PassportStatic } from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { AuthService } from '../services';
import { ValidatedUserResultDto } from '../dtos';
import { JwtPayload } from 'jsonwebtoken';

export const jwtStrategy = (passport: PassportStatic) => {
	const authService = new AuthService();
	const jwtOptions: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY!,
		ignoreExpiration: false,
	};

	return passport.use(
		new Strategy(
			jwtOptions,
			(payload: JwtPayload, done: DoneCallback) => {
				authService
					.validateUserJwt(payload)
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
