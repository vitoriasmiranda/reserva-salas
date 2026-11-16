const express = require('express');
const salasController = require('../controllers/salasController');
const reservasController = require('../controllers/reservasController');

const router = express.Router();

router.get('/', salasController.listar);
router.get('/:id', salasController.buscarPorId);
router.post('/', salasController.criar);
router.put('/:id', salasController.atualizar);
router.delete('/:id', salasController.remover);
router.get('/:id/reservas', reservasController.listarPorSala);

module.exports = router;