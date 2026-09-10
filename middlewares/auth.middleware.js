import jwt from 'jsonwebtoken'
import { JWT_SECRET, ROL_ADMIN } from '../config.js'

export function verifyToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            message: "Falta el token"
        });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token invalido"
        });
    }
}

export function verifyAdmin(req, res, next) {
    if (req.user?.rol !== ROL_ADMIN) {
        return res.status(403).json({
            message: "Solo un admin puede hacer esto"
        });
    }

    next();
}
