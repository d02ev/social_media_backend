import { PrismaClient } from '@prisma/client';

export class DatabaseService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        }
      },
      log: ['warn','error']
    });
  }
}

