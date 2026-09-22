import * as cancionService from '../services/cancion.service.js'

export async function  getCanciones (_, res) {
    try {
      const result = await cancionService.getCanciones()
      res.status(200).json({message:result.rows})

    }
    catch (err) {
      console.log("Error:", err)
      return res.status(500).json({message: err.message})
    }
}

export async function  getCancion (req, res) {
    const id = req.params.id;
    if(!id  )
      return res.status(400).json({message:"Tenes que enviar id!"})

    try {
      const result = await cancionService.getCancionById(id)
      res.status(200).json({message:result.rows[0]})

    }
    catch (err) {
      console.log("Error:", err)
      return res.status(500).json({message: err.message})
    }
}


export async function crearCancion(req, res) {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({
            message: "Debe indicar el nombre"
        });
    }

    try {
        const cancion = await cancionService.crearCancion(nombre);

        res.status(201).json({
            message: "Canción creada",
            cancion
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export async function modificarCancion(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!id || !nombre) {
        return res.status(400).json({
            message: "Debe indicar id y nombre"
        });
    }

    try {
        const cancion = await cancionService.modificarCancion(id, nombre);

        if (!cancion) {
            return res.status(404).json({
                message: "La canción no existe"
            });
        }

        res.json({
            message: "Canción modificada",
            cancion
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export async function borrarCancion(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Debe indicar el id"
        });
    }

    try {
        const cancion = await cancionService.borrarCancion(id);

        if (!cancion) {
            return res.status(404).json({
                message: "La canción no existe"
            });
        }

        res.json({
            message: "Canción borrada",
            cancion
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
