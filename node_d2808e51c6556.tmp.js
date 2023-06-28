//sistema de blog com autenticação adm
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')

//configurações
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//Public
app.use(express.static(path.join(__dirname +'/public')))

//mongo
mongoose.connect('mongodb://127.0.0.1:27017').then(() => {
    console.log("Conectado ao banco de dados")
}).catch(() => {
    console.log("Erro ao conectar db")
})





//rotas
app.get('/', (req, res) => {
    res.send('<h1>Pag inicial</h1>')
})
app.use('/admin', admin)


//iniciando sv
app.listen(8089, () => {

})