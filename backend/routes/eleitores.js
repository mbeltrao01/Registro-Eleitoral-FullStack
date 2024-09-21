const express = require('express');
const Eleitor = require('../models/Eleitor');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para adicionar um eleitor (precisa de autenticação)
router.post('/', authMiddleware, async (req, res) => {
    const { nome, etitulo, vote, foto } = req.body;
    if (!nome || !etitulo) {
        return res.status(400).json({ message: 'Nome e título são obrigatórios' });
    }

    try {
        const newEleitor = new Eleitor({ nome, etitulo, vote, foto });
        await newEleitor.save();
        res.json(newEleitor);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao salvar eleitor', err });
    }
});

// Rota para listar eleitores (precisa de autenticação)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const eleitores = await Eleitor.find();
        res.json(eleitores);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar eleitores', err });
    }
});

// Rota para atualizar um eleitor (precisa de autenticação)
router.put('/:id', authMiddleware, async (req, res) => {
    const { nome, etitulo, vote, foto } = req.body;
    try {
        const eleitor = await Eleitor.findById(req.params.id);
        if (!eleitor) {
            return res.status(404).json({ message: 'Eleitor não encontrado' });
        }
        eleitor.nome = nome;
        eleitor.etitulo = etitulo;
        eleitor.vote = vote;
        eleitor.foto = foto;
        await eleitor.save();
        res.json(eleitor);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar eleitor', err });
    }
});

// Rota para excluir um eleitor (precisa de autenticação)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const eleitor = await Eleitor.findById(req.params.id);
        if (!eleitor) {
            return res.status(404).json({ message: 'Eleitor não encontrado' });
        }
        await eleitor.deleteOne();
        res.json({ message: 'Eleitor excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir eleitor', err });
    }
});

module.exports = router;
