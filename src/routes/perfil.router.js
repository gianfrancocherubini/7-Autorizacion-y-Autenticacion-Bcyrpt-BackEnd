const { Router } = require('express');

const router = Router();

const auth = (req, res, next) => {
    if (!req.session.usuario) {
        res.status(401).redirect('/api/login'); 
        return;
    }

    next();
};

router.get('/', auth, (req, res) => {
    let usuario = req.session.usuario;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('perfil', { usuario });
});

module.exports = router;