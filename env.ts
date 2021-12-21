import * as dotenv from 'dotenv';
dotenv.config();

export const SESSION_SECRET = requireString(process.env.SESSION_SECRET);
export const NODE_ENV = process.env.NODE_ENV;
export const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgres://localhost:5432/messenger';
export const PORT = process.env.PORT ?? '3000';

function requireString(s: string | undefined): string {
  if (s === undefined) throw Error(`missing env variable`);
  return s;
}
