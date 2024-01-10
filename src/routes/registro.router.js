import { Router } from 'express';
import { UsuariosModelo } from '../dao/models/usuarios.model.js';
import { creaHash  } from '../utils.js';

export const router=Router()

const auth2 = (req, res, next) => {
    if (req.session.usuario) {
        res.status(401).redirect('/api/perfil'); 
        return;
    }

    next();
};


router.get('/', auth2, async (req, res) => {
    let { errorMessage } = req.query;
    let { message } = req.query;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('registro', { errorMessage, message, login : false });   
});

router.post('/', async (req, res) => {
    let { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).redirect('/api/registro?errorMessage=Complete todos los datos');
    }

    let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regMail.test(email)) {
        return res.status(400).redirect('/api/registro?errorMessage=Mail con formato incorrecto...!!!');
    }

    let existe = await UsuariosModelo.findOne({ email });
    if (existe) {
        return res.status(400).redirect(`/api/registro?errorMessage=Existen usuarios con email ${email} en la BD`);
    }

    if (email === 'adminCoder@coder.com' && password === 'coder123') {
        try {
            let usuario = await UsuariosModelo.create({ nombre, email, rol: 'administrador' });
            res.redirect(`/api/login?message=Usuario ${email} registrado correctamente`);
        } catch (error) {
            res.redirect('/api/registro?error=Error inesperado. Reintente en unos minutos');
        }
    } else {
        password = creaHash(password);
        try {
            let usuario = await UsuariosModelo.create({ nombre, email, password});
            res.redirect(`/api/login?message=Usuario ${email} registrado correctamente`);
        } catch (error) {
            res.redirect('/api/registro?error=Error inesperado. Reintente en unos minutos');
        }
    }
});

