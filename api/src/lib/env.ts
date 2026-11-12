import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT ?? 3333),
  HOST: process.env.HOST ?? '0.0.0.0',
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/cjr_joinville_db',
};
