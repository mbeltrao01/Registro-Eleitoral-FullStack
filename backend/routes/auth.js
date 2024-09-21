const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha inválida' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', err });
    }
});

// Rota para registrar um novo usuário (temporária, para fins de desenvolvimento)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Verifica se os campos foram preenchidos
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    try {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já registrado' });
        }

        // Cria um novo usuário
        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor ao registrar usuário', err });
    }
});



module.exports = router;
