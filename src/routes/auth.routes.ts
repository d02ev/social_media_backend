import { Router } from 'express';
import { AuthController } from '../controllers';
import { profileImageUploadHandler } from '../middlewares';
import passport from 'passport';

export const auth_routes = Router();
const auth_controller = new AuthController();

auth_routes
	.post('/register', profileImageUploadHandler, auth_controller.register)
	.post(
		'/login',
		passport.authenticate('local', { session: false }),
		auth_controller.login,
	)
	.get('/refresh', auth_controller.refreshAccessToken)
	.post(
		'/logout',
		passport.authenticate('jwt', { session: false }),
		auth_controller.logout,
	);
