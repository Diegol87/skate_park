const express = require('express')
const router = express.Router()

router.get("/", (req, res) => res.render("home"))
router.get("/login", (req, res) => res.render("login"))
router.get("/register", (req, res) => res.render("register"))
router.get("/details", (req, res) => res.render("details"))
router.get("/adminaccess", (req, res) => res. render("admin"))

module.exports = router