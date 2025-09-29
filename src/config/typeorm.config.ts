import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USER', 'nestuser'),
  password: configService.get<string>('DB_PASSWORD', 'nestpass'),
  database: configService.get<string>('DB_NAME', 'nestdb'),
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
});
