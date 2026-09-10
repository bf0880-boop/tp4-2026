import * as escuchaService from '../services/escucha.service.js'

export async function escuchar(req, res) {
    const usuarioId = req.user.id;
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Debe indicar el id de la canción"
        });
    }

    try {
        const resultado = await escuchaService.escuchar(usuarioId, id);

        if (resultado.error) {
            return res.status(resultado.status).json({
                message: resultado.error
            });
        }

        res.json({
            message: "Escucha registrada",
            fan: resultado.fan,
            escuchas: resultado.escuchas
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
