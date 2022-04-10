const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:esadiz87@localhost:5432/skatepark'

const pool = process.env.DATABASE_URL  
    ? new Pool({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    })
    
    : new Pool({connectionString})

const getUsersDB = async() => {
    const client = await pool.connect()
    try{
        const respuesta = await client.query('SELECT id, nombre, email, anos_experiencia, especialidad, estado, foto FROM skaters')
        return {
            ok: true,
            skaters: respuesta.rows,
        }
    } catch(err) {
        return {
            ok: false,
            msg: err.message,
        }
    } finally {
        client.release()
    }
}

const createUserDB = async({ email, nombre, hashPassword, anos_experiencia, especialidad, pathFoto }) => {
    const client = await pool.connect()

    const query = {
        text: 'INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        values: [email, nombre, hashPassword, anos_experiencia, especialidad, pathFoto, false]
    }

    try {
        const respuesta = await client.query(query)
        const { id } = respuesta.rows[0]
        return {
            ok: true,
            id,
        }
    } catch(err) {
    console.log(err)
    if(err.code === '23505') {
        return {
            ok: false,
            msg: 'Ya existe el email registrado'
        }
    }

        return {
            ok: false,
            msg: err.message
        }
    } finally {
        client.release()
    }
}

const getUserDB = async(email) => {
    const client = await pool.connect()

    const query = {
        text: 'SELECT * FROM skaters WHERE email = $1',
        values: [email]
    }

    try {
        const respuesta = await client.query(query)
        
        return {
            ok: true,
            user: respuesta.rows[0],
        }
    } catch(err) {

        return {
            ok: false,
            msg: err.message
        }

    } finally {
        client.release()
    }
}

const getUseridDB = async(id) => {
    const client = await pool.connect()

    const query = {
        text: 'SELECT id, email, nombre, anos_experiencia, especialidad, estado, foto FROM skaters WHERE id = $1',
        values: [Number(id)]
    }

    try {
        const respuesta = await client.query(query)

        return {
            ok: true,
            skater: respuesta.rows[0]
        }
    } catch (err) {
        return {
            ok: false,
            msg: err.message
        }

    } finally {
    client.release()
    }   
}

const editUsersStatusDB = async({ id, status }) => {
    const client = await pool.connect()

    const query = {
        text: 'UPDATE skaters SET estado = $1 WHERE id = $2',
        values: [status, Number(id)]
    }
    try {
        await client.query(query)

        return {
            ok: true,
        }

    } catch (err) {
        return {
            ok: false,
            msg: err.message
        }

    } finally {
        client.release()
    }
}

const editUserDB = async({ id, nombre, password, anos_experiencia, especialidad }) => {
    const client = await pool.connect()

    const query = {
        text: 'UPDATE skaters SET nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $1',
        values: [ Number[id], nombre, password, anos_experiencia, especialidad]
    }

    try {
        const respuesta = await client.query(query)
        
        return {
            ok: true,
            skater: respuesta.rows
        }

    } catch (err) {
        return {
            ok: false,
            msg: err.message
        }
    } finally {
        client.release()
    }
}

const deleteUserDB = async(id) => {
    const client = await pool.connect()

    const query = {
        text: 'DELETE FROM skaters WHERE id = $1',
        values: [id]
    }

    try {
        await client.query(query)

        return {
            ok: true
        }

    } catch (err) {
        return {
            ok: false,
            msg: err.message
        }
    } finally {
        client.release()
    }
}

module.exports = { getUsersDB, createUserDB, getUserDB, getUseridDB, editUsersStatusDB, editUserDB, deleteUserDB }