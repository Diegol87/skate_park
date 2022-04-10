const express = require("express")
const expressFileUpload = require('express-fileupload')
const { getUsers, createUser, loginUser, getUser, editUsersStatus, editUser, deleteUser } = require("../controllers/user.controller")
const { requireAuth } = require("../middlewares/requireAuth")
const { requireDatos, requireLogin } = require("../middlewares/requireDatos")

const router = express.Router()

router.use(expressFileUpload({
    abortOnLimit: true
}))

router.get("/users", requireAuth, getUsers)
router.post("/users", requireDatos, createUser)
router.post("/login", requireLogin,loginUser)
router.get("/user", requireAuth, getUser)
router.put("/users/status", editUsersStatus)
router.put("/user/:id", editUser)
router.delete("/user/:id", deleteUser)

module.exports = router
