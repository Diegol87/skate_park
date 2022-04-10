const { nanoid } = require('nanoid')

const requireDatos = (req, res, next) => {
    try {
        //el signo ? pregunta si el campo esta como undifined
    const { email, nombre, password, anos_experiencia, especialidad } = req.body
    
    if(
        !email?.trim() || 
        !nombre?.trim() || 
        !password?.trim() || 
        !anos_experiencia?.trim() || 
        !especialidad?.trim() || 
        !req.files?.foto 
        ) {

        throw new Error("Algunos campos estan vacios")
    }

    const { foto } = req.files
    const mimeTypes = ["image/jpeg", "image/png"]
    if(!mimeTypes.includes(foto.mimetype)){

        throw new Error("Solo archivos png o jpg")
    }
    if(foto.size > 5 * 1024 * 1024) {

        throw new Error("Maximo 5MB")
    }
    
    const pathFoto = `${nanoid()}.${foto.mimetype.split("/")[1]}`
    req.pathFoto = pathFoto

    next()

    } catch(err) {
        return res.status(400).json({
            ok: false,
            msg: err.message
        })
    }
} 

const requireLogin = (req, res, next) => {
    try {
        const { email, password } = req.body

        if(
            !email?.trim() ||
            !password?.trim()
        ) {
            throw new Error("Algunos campos estan vacios")
        }

        next()
    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: err.message
        })
    }
}


module.exports = {
    requireDatos, 
    requireLogin
}