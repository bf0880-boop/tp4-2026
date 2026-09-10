import 'dotenv/config';

export const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';
export const PORT = process.env.PORT || 3000;
export const ROL_ADMIN = 'A';
export const ROL_USUARIO = 'U';

export const CANCIONES_PARA_SER_FAN = 10;
