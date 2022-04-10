const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    try {
        if(!req.headers?.authorization) {
            throw new Error("No existe el token")
        }
        
        const token = req.headers.authorization.split(" ")[1];
        
        if(!token) {
            throw new Error("Formato no valido usar Bearer")
        }
       
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        
        req.id = payload.id

        next()

    } catch (err) {
        if(err.message === "jwt malformed") {
            return res.status(401).json({
                ok: false,
                msg: "Formato no valido del Token"
            })
        }

        if(
            err.message === "invalid token" || 
            err.message === "jwt expired"
            ) {
                return res.status(401).json({
                    ok: false,
                    msg: "Token invalido"
                })
        }

        return res.status(401).json({
            ok: false,
            msg: err.message 
        })
    }
}

module.exports = { requireAuth }