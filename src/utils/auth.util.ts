import { hash, compare } from 'bcrypt';
import { JwtPayload, sign, decode } from 'jsonwebtoken';

export class AuthUtil {
	private readonly _access_token_secret_key: string;
	private readonly _refresh_token_secret_key: string;
	private readonly _verification_token_secret_key: string;
	private readonly _access_token_expiry: string;
	private readonly _refresh_token_expiry: string;
	private readonly _verification_token_expiry: string;
	private readonly _hash_salt_rounds: number;

	constructor() {
		this._access_token_secret_key = process.env.ACCESS_TOKEN_SECRET_KEY!;
		this._refresh_token_secret_key = process.env.REFRESH_TOKEN_SECRET_KEY!;
		this._verification_token_secret_key =
			process.env.VERIFICATION_TOKEN_SECRET_KEY!;
		this._access_token_expiry = process.env.ACCESS_TOKEN_EXPIRY!;
		this._refresh_token_expiry = process.env.REFRESH_TOKEN_EXPIRY!;
		this._verification_token_expiry = process.env.VERIFICATION_TOKEN_EXPIRY!;
		this._hash_salt_rounds = parseInt(process.env.HASH_SALT_ROUNDS!) || 10;
	}

	createPassHash = async (password: string): Promise<string> =>
		await hash(password, this._hash_salt_rounds);

	comparePassHash = async (
		password: string,
		hash: string,
	): Promise<boolean> => {
		return await compare(password, hash);
	};

	genAccessToken = (payload: JwtPayload): string => {
		return sign(payload, this._access_token_secret_key, {
			expiresIn: this._access_token_expiry,
		});
	};

	genRefreshToken = (payload: JwtPayload): string => {
		return sign(payload, this._refresh_token_secret_key, {
			expiresIn: this._refresh_token_expiry,
		});
	};

	genVerificationToken = (): string => {
		const payload = crypto.randomUUID();
		return sign({ payload }, this._verification_token_secret_key, {
			expiresIn: this._verification_token_expiry,
		});
	};

	decodeToken = (token: string): JwtPayload | string | null => {
		return decode(token);
	};
}
