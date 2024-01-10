import { Router } from 'express';
import { UsuariosModelo } from '../dao/models/usuarios.model.js';
import { validaPassword } from '../utils.js';

export const router=Router()

const auth2 = (req, res, next) => {
    if (req.session.usuario) {
        res.status(401).redirect('/api/perfil'); 
        return;
    }

    next();
};

router.get('/', auth2, (req, res) => {
    let { error, message } = req.query;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('login', { error, message, login: false });
});

router.post('/', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        res.status(400).redirect('/api/login?message=Complete todos los datos'); 
        return;
    }

    let usuario = await UsuariosModelo.findOne({ email });

    if (!usuario) {
        res.status(401).redirect(`/api/login?error=credenciales incorrectas`); 
        return;
    }

    if (!validaPassword(usuario, password)) {
        res.status(401).redirect(`/api/login?error=credenciales incorrectas`); 
        return;
    }


    req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    };

    res.redirect('/home');
});

