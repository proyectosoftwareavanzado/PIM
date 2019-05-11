'use strict'

const express = require('express');

/*************Instancias controladores administrador****************/
const user = require('../controllers/users/user');
const productos = require('../controllers/PIM/productos');
const auth = require('../controllers/mdl');
/*******************************************************************/

const api = express.Router();

api.get('/users',user.listUsers);
api.get('/PIM/obtenerCatalogo',auth.checkToken,productos.obtenerCatalogo)
api.get('/PIM/enriquecerProducto/:SKUs?',auth.checkToken,productos.enriquecerProducto)
api.get('/PIM/deProducto/',productos.deProducto)
api.get('/PIM/periodo/',productos.periodo)
api.get('/PIM/truncarReporte/',productos.truncarReporte)
api.get('/PIM/recargarProducto/',productos.recargarProductos)

module.exports = api;