import { PasswordDetail } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

export class PasswordDetailRepository {
  private readonly _db_service: DatabaseService;

  constructor() {
    this._db_service = new DatabaseService();
  }

  createRefreshToken = async (userId: string, refreshToken: string): Promise<PasswordDetail | null | undefined> => {
    return await this._db_service.passwordDetail.update({
      where: { userId },
      data: {
        refreshToken
      }
    });
  };

  fetchPasswordDetailsByUserId = async (userId: string): Promise<PasswordDetail | null | undefined> => {
    return await this._db_service.passwordDetail.findUnique({
      where: { userId }
    });
  };
}