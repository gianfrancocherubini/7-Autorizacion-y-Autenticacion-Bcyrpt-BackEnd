const express = require('express');
const routerCarrito = require('./routes/carrito.router');
const routerHome  = require('./routes/products.router');
const routerRegistro =require ('./routes/registro.router')
const routerLogin =require ('./routes/login.router')
const routerPerfil =require ('./routes/perfil.router')
const routerLogout =require ('./routes/logout.router')
const {engine}=require('express-handlebars')
const path = require('path');
const mongoose =require(`mongoose`)
const sessions = require ('express-session')
const mongoStore = require ('connect-mongo')
const cookieParser = require('cookie-parser');

const PORT = 3012;
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessions(
    {
        secret:"codercoder123",
        resave: true, 
        saveUninitialized: true,
        store: mongoStore.create(
            {
                mongoUrl:'mongodb+srv://cherussa:chilindrina123@gianfrancocluster.km1jj9i.mongodb.net/?retryWrites=true&w=majority',
                mongoOptions:{ dbName: 'ecommerce' },
                ttl:3600
            }
        )
    }
))


app.use('/home', (req, res, next) => {
    // Pasa la información del usuario a la vista "home" solo si se ha iniciado sesión
    if (req.session.usuario) {
        res.locals.usuario = req.session.usuario;

        // Verifica si la consulta 'login' está presente y muestra el mensaje de bienvenida
        if (req.query.login === 'success') {
            res.locals.welcomeMessage = true;
        }
    }

    next();
}, routerHome);
app.use('/api/carts', routerCarrito)
app.use('/api/registro', routerRegistro)
app.use('/api/perfil', routerPerfil)
app.use('/api/login', routerLogin)
app.use('/api/logout', routerLogout)


const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://cherussa:chilindrina123@gianfrancocluster.km1jj9i.mongodb.net/?retryWrites=true&w=majority', { dbName: 'ecommerce' });
        console.log('DB online..!');
    } catch (error) {
        console.log(error.message);
    }
};

connectToDatabase();


const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});
