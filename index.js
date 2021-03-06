require('dotenv').config()
const express = require('express')
const app = express()
const { create } = require('express-handlebars')
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

const hbs = create({
    partialsDir: ["views/components"],
    extname: ".hbs"
})

app.engine(".hbs", hbs.engine)
app.set("view engine", ".hbs")
app.set("views", "./views")

app.use("/api/v1/", require('./routes/users.route'))
app.use("/", require('./routes/vistas.route'))

app.listen(PORT, console.log("Andando en http://localhost:3000"))

