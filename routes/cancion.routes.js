import { Router } from 'express'
import * as cancionController from '../controllers/cancion.controller.js'
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js'

const router = Router();

router.get('/cancion/:id',verifyToken, cancionController.getCancion)
router.get('/cancion',verifyToken, cancionController.getCanciones)
router.post('/cancion', verifyToken, verifyAdmin, cancionController.crearCancion);
router.put('/cancion/:id', verifyToken, verifyAdmin, cancionController.modificarCancion);
router.delete('/cancion/:id', verifyToken, verifyAdmin, cancionController.borrarCancion);

export default router;
