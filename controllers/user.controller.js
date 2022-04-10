const { getUsersDB, createUserDB, getUserDB, getUseridDB, editUsersStatusDB, editUserDB, deleteUserDB } = require('../database/db')
const bcrypt = require('bcryptjs')
const path = require('path')
const jwt = require('jsonwebtoken')

const getUsers = async(req, res) => {
    const respuesta = await getUsersDB()
    if(!respuesta.ok){
        return res.status(500).json({ 
            ok: false,
            msg: respuesta.msg })
    }
    return res.json({ 
        ok: true,
        skaters: respuesta.skaters 
    })
}

const createUser = async(req, res) => {
    try {

    const { email, nombre, password, anos_experiencia, especialidad, estado } = req.body 
    const { foto } = req.files

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt) 

    const respuesta = await createUserDB({ email, nombre, hashPassword, anos_experiencia, especialidad, pathFoto: req.pathFoto, estado })
    if(!respuesta.ok) {
        throw new Error(respuesta.msg)
    }
    
    //esta linea de codigo sirve para guardar la img
    foto.mv(path.join(__dirname, "../public/avatars/", req.pathFoto)), (err) => {
        if(err) throw new Error("No se puede guardar la imagen")
    }  

    //jwt
    const payload = { id: respuesta.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.json({
        ok: true,
        token,
    })

    } catch(err) {
    
        return res.status(400).json({
            ok: false,
            msg: err.message
        })
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body

        const respuesta = await getUserDB(email)
        if(!respuesta.ok) {
            throw new Error(respuesta.msg)
        }

        if(!respuesta.user) {
            throw new Error("No existe el email registrado")
        }

        const { user } = respuesta
        const  comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword) {
            throw new Error('Contraseña incorrecta')
        }

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

        return res.json({
            ok: true,
            token,
        })

    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: err.message
        })
    }
}

const getUser = async(req, res) => {

        const respuesta = await getUseridDB(req.id)
        if(!respuesta.ok) {
            return res.status(500).json({
                ok: false,
                msg: respuesta.msg
            })
        }
        return res.json({
            ok: true,
            skater: respuesta.skater
        })
    }

    const editUsersStatus = async(req, res) => {
        try {
            const { id, status } = req.body
            const respuesta = await editUsersStatusDB({ id, status })

            if(!respuesta.ok) {
                throw new Error(respuesta.msg)
            }
            return res.json({
                ok: true
            }) 

        } catch (err) {
            return res.status(400).json({
                ok: false,
                msg: err.message
            })

        }
    }

    const editUser = async(req, res) => {
        try {
            const { id } = req.params
            const { nombre, password, anos_experiencia, especialidad } = req.body
            
            const respuesta = await editUserDB({ id, nombre, password, anos_experiencia, especialidad })

            if(!respuesta.ok) {
                throw new Error(respuesta.msg)
            }

            return res.json({
                ok: true,
            })

        } catch (err) {
            return res.status(400).json({
                ok: false,
                msg: err.message
            })
        }
    }

    const deleteUser = async(req, res) => {
        const { id } = req.params

        try {
            const respuesta = await deleteUserDB(id)
            if(!respuesta.ok) {
                throw new Error(respuesta.error)
            }
            return res.json({
                ok: true
            })
 
        } catch (err) {
            return res.status(400).json({
                ok: false,
                msg: err.message
            })
        }
    }


module.exports = { getUsers, createUser, loginUser, getUser, editUsersStatus, editUser, deleteUser }