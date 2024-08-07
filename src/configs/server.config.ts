import { Application } from 'express';
import { logger } from '../utils';
import { AppErrorCodes } from '../enums';

export class ServerConfig {
	private readonly _port_number: number;
	private readonly _exp_app: Application;
	private readonly _app_environment: string;

	constructor(portNumber: number, expApp: Application) {
		this._port_number = portNumber;
		this._exp_app = expApp;
		this._app_environment = process.env.NODE_ENV! || 'development';
	}

	initServer = () => {
		try {
			if (
				this._app_environment === 'development' ||
				this._app_environment === 'test'
			) {
				this._exp_app.listen(this._port_number, () =>
					logger.info(
						`The Server Is Running At http://localhost:${this._port_number}`,
					),
				);
			}
			if (this._app_environment === 'production') {
				logger.info('Server Initiated Successfully.....');
				this._exp_app.listen(this._port_number);
			}
		} catch (err: any) {
			logger.error(
				'An Error Occurred While Spinning Up The Server. Exiting Now....',
				{
					errorCode: AppErrorCodes.INIT_SERVER_FAILURE,
					errorStack: err.stack,
				},
			);
			process.exit(1);
		}
	};
}
