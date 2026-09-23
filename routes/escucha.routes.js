import { Router } from 'express'
import * as escuchaController from '../controllers/escucha.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router();

router.get('/escucho', verifyToken, escuchaController.getEscucho)
router.post('/escucho', verifyToken, escuchaController.escuchar);

export default router;
